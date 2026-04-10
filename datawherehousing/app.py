import streamlit as st
import pandas as pd
import plotly.express as px
from sqlalchemy import create_engine

# Configuración de base de datos MySQL 
# Se conecta al puerto 3307 de la máquina anfitriona (establecido en tu docker-compose)
DB_URL = "mysql+pymysql://root:root@localhost:3307/dw_ventas_reservas"

@st.cache_resource
def get_engine():
    return create_engine(DB_URL)

@st.cache_data
def get_sales_data():
    engine = get_engine()
    query = """
    SELECT 
        s.date_key, d.full_date, d.month, d.month_name, d.year, d.day_of_week,
        s.quantity, s.unit_price, s.subtotal, s.payment_method,
        p.name as product_name, p.category,
        b.name as branch_name
    FROM Fact_Sales s
    JOIN Dim_Date d ON s.date_key = d.date_key
    JOIN Dim_Product p ON s.product_key = p.product_key
    LEFT JOIN Dim_Branch b ON s.branch_key = b.branch_key
    """
    return pd.read_sql(query, engine)

@st.cache_data
def get_payroll_data():
    engine = get_engine()
    query = """
    SELECT 
        p.date_key, d.full_date, d.month_name, d.year,
        e.full_name, e.role, e.position, e.contract_type,
        p.base_salary, p.bonus, p.deductions, p.net_salary
    FROM Fact_Payroll p
    JOIN Dim_Date d ON p.date_key = d.date_key
    JOIN Dim_Employee e ON p.employee_key = e.employee_key
    """
    return pd.read_sql(query, engine)

@st.cache_data
def get_orders_data():
    engine = get_engine()
    query = """
    SELECT 
        o.created_date_key, o.delivery_date_key,
        c.full_date as created_date, d.full_date as delivery_date,
        o.quantity, o.advance_payment, o.order_status, o.event_type,
        p.name as product_name, br.name as branch_name
    FROM Fact_Orders o
    LEFT JOIN Dim_Date c ON o.created_date_key = c.date_key
    LEFT JOIN Dim_Date d ON o.delivery_date_key = d.date_key
    LEFT JOIN Dim_Product p ON o.product_key = p.product_key
    LEFT JOIN Dim_Branch br ON o.branch_key = br.branch_key
    """
    return pd.read_sql(query, engine)

st.set_page_config(page_title="Pastry DW Dashboard", layout="wide")

st.title("🍰 Dashboard Analítico - Pastry DW")
st.markdown("Visualización de datos extraídos mediante el proceso ETL desde el sistema Pastry hacia el Data Warehouse.")

# 1. Ventas
st.header("1. Análisis de Ventas")
try:
    df_sales = get_sales_data()
    if not df_sales.empty:
        col1, col2, col3 = st.columns(3)
        col1.metric("Total Ingresos Ventas", f"${df_sales['subtotal'].sum():,.2f}")
        col2.metric("Total Operaciones", len(df_sales))
        col3.metric("Unidades Vendidas", df_sales['quantity'].sum())
        
        # Tabs for better organization
        tab1, tab2, tab3 = st.tabs(["Resumen y Tendencias", "Análisis Temporal", "Análisis de Producto y Sucursal"])
        
        with tab1:
            col_fig1, col_fig2 = st.columns(2)
            # Grafico 1
            cat_sales = df_sales.groupby('category')['subtotal'].sum().reset_index()
            fig1 = px.pie(cat_sales, values='subtotal', names='category', title='Ventas por Categoría', hole=0.4)
            col_fig1.plotly_chart(fig1, use_container_width=True)
            
            # Grafico 2
            daily_sales = df_sales.groupby('full_date')['subtotal'].sum().reset_index()
            fig2 = px.line(daily_sales, x='full_date', y='subtotal', title='Tendencia de Ventas Diarias (Histórico)', markers=True)
            col_fig2.plotly_chart(fig2, use_container_width=True)
            
        with tab2:
            st.subheader("Análisis de Ventas en el Tiempo")
            col_t1, col_t2 = st.columns(2)
            
            # Ventas por Año
            yearly_sales = df_sales.groupby('year')['subtotal'].sum().reset_index()
            fig_year = px.bar(yearly_sales, x='year', y='subtotal', title='Ventas por Año', text_auto='.2s')
            fig_year.update_layout(xaxis_type='category')
            col_t1.plotly_chart(fig_year, use_container_width=True)
            
            # Ventas por Mes
            # Sort by month number
            monthly_sales = df_sales.groupby(['month', 'month_name'])['subtotal'].sum().reset_index()
            monthly_sales = monthly_sales.sort_values('month')
            fig_month = px.bar(monthly_sales, x='month_name', y='subtotal', title='Ventas por Mes', text_auto='.2s')
            col_t2.plotly_chart(fig_month, use_container_width=True)
            
            # Ventas por Día de la Semana
            st.markdown("### Ventas por Día de la Semana")
            # Create a categorical order for days of week
            days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            df_sales['day_of_week'] = pd.Categorical(df_sales['day_of_week'], categories=days_order, ordered=True)
            dow_sales = df_sales.groupby('day_of_week', observed=False)['subtotal'].sum().reset_index()
            fig_dow = px.bar(dow_sales, x='day_of_week', y='subtotal', title='Ventas por Día de la Semana', text_auto='.2s')
            st.plotly_chart(fig_dow, use_container_width=True)
            
        with tab3:
            col_p1, col_p2 = st.columns(2)
            
            # Top 10 Productos
            top_products = df_sales.groupby('product_name')['subtotal'].sum().nlargest(10).reset_index()
            fig_prod = px.bar(top_products, x='subtotal', y='product_name', orientation='h', title='Top 10 Productos Más Vendidos')
            fig_prod.update_layout(yaxis={'categoryorder':'total ascending'})
            col_p1.plotly_chart(fig_prod, use_container_width=True)
            
            # Ventas por Sucursal
            if 'branch_name' in df_sales.columns:
                df_branches = df_sales.fillna({'branch_name': 'Sin Sucursal'})
                branch_sales = df_branches.groupby('branch_name')['subtotal'].sum().reset_index()
                fig_branch = px.pie(branch_sales, values='subtotal', names='branch_name', title='Ventas por Sucursal', hole=0.3)
                col_p2.plotly_chart(fig_branch, use_container_width=True)

        st.subheader("Ventas Detalladas")
        st.dataframe(df_sales.head(10))
    else:
        st.info("No hay datos de ventas disponibles tras el ETL.")
except Exception as e:
    st.error(f"Error cargando hechos de ventas: {e}")

st.divider()

# 2. Órdenes / Reservas
st.header("2. Análisis de Órdenes y Reservas")
try:
    df_orders = get_orders_data()
    if not df_orders.empty:
        col1, col2 = st.columns(2)
        
        # Filtro de status nulo
        df_orders['order_status'] = df_orders['order_status'].fillna('N/A')
        status_count = df_orders['order_status'].value_counts().reset_index()
        status_count.columns = ['Estatus', 'Cantidad']
        fig3 = px.bar(status_count, x='Estatus', y='Cantidad', title='Volumen de Órdenes por Estado', color='Estatus')
        col1.plotly_chart(fig3, width='stretch')
        
        df_orders['event_type'] = df_orders['event_type'].fillna('Sin Especificar')
        event_count = df_orders['event_type'].value_counts().reset_index()
        event_count.columns = ['Tipo de Evento', 'Cantidad']
        fig4 = px.pie(event_count, names='Tipo de Evento', values='Cantidad', title='Distribución por Tipo de Evento')
        col2.plotly_chart(fig4, width='stretch')
    else:
        st.info("No hay datos de órdenes disponibles.")
except Exception as e:
    st.error(f"Error cargando órdenes: {e}")

st.divider()

# 3. Nómina 
st.header("3. Análisis de Nómina e Incentivos")
try:
    df_payroll = get_payroll_data()
    if not df_payroll.empty:
        col1, col2 = st.columns(2)
        total_payroll = df_payroll['net_salary'].sum()
        col1.metric("Gasto Total de Nómina Histórico", f"${total_payroll:,.2f}")
        
        total_bonus = df_payroll['bonus'].sum()
        col2.metric("Total Bonos/Incentivos Entregados", f"${total_bonus:,.2f}")
        
        # Grafico 5
        role_payroll = df_payroll.groupby('role')['net_salary'].sum().reset_index()
        fig5 = px.bar(role_payroll, x='role', y='net_salary', title='Inversión de Nómina por Rol', color='role')
        st.plotly_chart(fig5, width='stretch')
    else:
        st.info("No hay datos de nómina disponibles.")
except Exception as e:
    st.error(f"Error cargando nómina: {e}")
