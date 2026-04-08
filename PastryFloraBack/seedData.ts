import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

// ─── Helpers ───────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

// Genera fecha aleatoria dentro de un rango en ese mismo día
function dateAt(year: number, month: number, day: number, h = 8, m = 0): string {
  const hh = rand(h, h + 6);
  const mm = rand(0, 59);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`;
}

// Precio de torta normal interpolado entre 2021 y 2025
const TORTA_PRICES_2021 = [40, 60, 80, 100, 100];
const TORTA_PRICES_2025 = [60, 80, 90, 110, 120];
function tortaPrice(size: number, year: number): number {
  const t = Math.max(0, Math.min(1, (year - 2021) / 4));
  const base = TORTA_PRICES_2021[size - 1];
  const target = TORTA_PRICES_2025[size - 1];
  return parseFloat((base + (target - base) * t).toFixed(2));
}

// Precio de Selva Negra (doble de torta normal >=2)
function selvaNegraPrice(size: number, year: number): number {
  return parseFloat((tortaPrice(size, year) * 2).toFixed(2));
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'Pastry',
    multipleStatements: true,
  });

  console.log('✅ Conexión exitosa. Iniciando seed...');

  // ─── 1. BRANCHES ─────────────────────────────────────────────────────────────
  console.log('📦 Insertando sucursales...');
  const [branchRows]: any = await conn.query(`SELECT id FROM branches LIMIT 5`);
  let branchIds: number[] = branchRows.map((r: any) => r.id);
  if (branchIds.length === 0) {
    await conn.query(`
      INSERT INTO branches (name, address) VALUES
        ('Sucursal Central', 'Av. Principal 123'),
        ('pastryflora 8', 'Dirección sucursal 8'),
        ('PastryFlra 13', 'Dirección sucursal 13')
    `);
    const [b2]: any = await conn.query(`SELECT id FROM branches`);
    branchIds = b2.map((r: any) => r.id);
  }
  console.log(`   → ${branchIds.length} sucursales disponibles`);

  // ─── 2. EMPLOYEES (Users + Employees table) ──────────────────────────────────
  console.log('👥 Insertando empleados...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const employees = [
    { first: 'Romer',     last: 'Toco',    role: 'SUPERVISOR', salary: 3800, position: 'Supervisor General',      dept: 'Operaciones',    hired: '2019-03-01' },
    { first: 'Marcelo',   last: 'Toco',    role: 'PANADERO',   salary: 2800, position: 'Panadero Principal',      dept: 'Producción',     hired: '2019-03-01' },
    { first: 'Edwin',     last: 'Toco',    role: 'PANADERO',   salary: 2600, position: 'Panadero Junior',         dept: 'Producción',     hired: '2020-01-10' },
    { first: 'Ivan',      last: 'Toco',    role: 'DECORADOR',  salary: 2700, position: 'Decorador Principal',     dept: 'Producción',     hired: '2019-06-15' },
    { first: 'Bernardo',  last: 'Morales', role: 'ADMIN',      salary: 5000, position: 'Administrador',           dept: 'Administración', hired: '2019-01-01' },
    { first: 'Heriberto', last: 'Toco',    role: 'PANADERO',   salary: 2600, position: 'Ayudante Producción',     dept: 'Producción',     hired: '2020-05-01' },
    { first: 'Flora',     last: 'Yucra',   role: 'CONTADOR',   salary: 3500, position: 'Contadora',               dept: 'Administración', hired: '2019-02-01' },
    { first: 'Carmen',    last: 'Villca',  role: 'DECORADOR',  salary: 2700, position: 'Decoradora',              dept: 'Producción',     hired: '2021-03-15' },
    { first: 'Miguel',    last: 'Quispe',  role: 'PANADERO',   salary: 2500, position: 'Panadero',                dept: 'Producción',     hired: '2022-01-10' },
    { first: 'Patricia',  last: 'Mamani',  role: 'COUNTER',    salary: 2300, position: 'Vendedora',               dept: 'Ventas',         hired: '2021-07-01' },
    { first: 'Roberto',   last: 'Flores',  role: 'COUNTER',    salary: 2300, position: 'Vendedor',                dept: 'Ventas',         hired: '2023-02-01' },
    { first: 'Lucía',     last: 'Condori', role: 'COUNTER',    salary: 2200, position: 'Vendedora Junior',        dept: 'Ventas',         hired: '2024-01-15' },
  ];

  const empIds: number[] = [];
  for (const e of employees) {
    const email = `${e.first.toLowerCase()}.${e.last.toLowerCase()}@pastry.com`;
    const [existing]: any = await conn.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      empIds.push(existing[0].id);
      continue;
    }
    const [res]: any = await conn.query(
      `INSERT INTO users (first_name, last_name, email, password, role, salary, active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [e.first, e.last, email, passwordHash, e.role, e.salary]
    );
    const uid = res.insertId;
    empIds.push(uid);
    await conn.query(
      `INSERT INTO employees (user_id, hire_date, position, department, contract_type) VALUES (?, ?, ?, ?, 'FULL_TIME')`,
      [uid, e.hired, e.position, e.dept]
    );
  }
  console.log(`   → ${empIds.length} empleados disponibles`);

  // ─── 3. PAYROLL (5 años mensuales) ───────────────────────────────────────────
  console.log('💰 Insertando planillas de pago...');
  const [existingPayroll]: any = await conn.query(`SELECT COUNT(*) as c FROM payroll`);
  if (existingPayroll[0].c === 0) {
    const payrollRows: any[] = [];
    for (let year = 2020; year <= 2025; year++) {
      for (let month = 1; month <= 12; month++) {
        if (year === 2025 && month > 4) break;
        const endDate = new Date(year, month, 0);
        const paidDate = `${year}-${String(month).padStart(2, '0')}-${endDate.getDate()}`;
        const isDecember = month === 12;
        for (let i = 0; i < employees.length; i++) {
          const uid = empIds[i];
          const emp = employees[i];
          if (emp.hired > paidDate) continue;
          const bonus = isDecember ? 700 : 0;
          const deductions = 0;
          const final_salary = emp.salary + bonus - deductions;
          payrollRows.push([uid, emp.salary, bonus, deductions, final_salary, paidDate]);
        }
      }
    }
    // Insert in batches
    for (let i = 0; i < payrollRows.length; i += 200) {
      const batch = payrollRows.slice(i, i + 200);
      const placeholders = batch.map(() => '(?,?,?,?,?,?)').join(',');
      await conn.query(
        `INSERT INTO payroll (user_id, base_salary, bonuses, deductions, final_salary, payment_date) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log(`   → ${payrollRows.length} registros de payroll insertados`);
  } else {
    console.log(`   → Payroll ya existente, saltando...`);
  }

  // ─── 4. PRODUCTS ─────────────────────────────────────────────────────────────
  console.log('🎂 Insertando productos...');
  const [existingProducts]: any = await conn.query(`SELECT id, name FROM products`);
  const productMap: Record<string, number> = {};
  for (const p of existingProducts) productMap[p.name] = p.id;

  const productsToInsert = [
    { name: 'Torta Tamaño 1', desc: 'Torta pequeña para 8-10 personas', price: 40, cat: 'Tortas' },
    { name: 'Torta Tamaño 2', desc: 'Torta mediana para 12-15 personas', price: 60, cat: 'Tortas' },
    { name: 'Torta Tamaño 3', desc: 'Torta grande para 20-25 personas', price: 80, cat: 'Tortas' },
    { name: 'Torta Tamaño 4', desc: 'Torta extra grande para 30-35 personas', price: 100, cat: 'Tortas' },
    { name: 'Torta Tamaño 5', desc: 'Torta familiar para 40-50 personas', price: 100, cat: 'Tortas' },
    { name: 'Selva Negra Tamaño 2', desc: 'Selva Negra especial para 12-15 personas', price: 120, cat: 'Tortas Especiales' },
    { name: 'Selva Negra Tamaño 3', desc: 'Selva Negra especial para 20-25 personas', price: 160, cat: 'Tortas Especiales' },
    { name: 'Selva Negra Tamaño 4', desc: 'Selva Negra especial para 30-35 personas', price: 200, cat: 'Tortas Especiales' },
    { name: 'Selva Negra Tamaño 5', desc: 'Selva Negra especial para 40-50 personas', price: 200, cat: 'Tortas Especiales' },
    { name: 'Torta Evento Grande 200', desc: 'Torta gigante para eventos especiales', price: 200, cat: 'Eventos' },
    { name: 'Torta Evento Grande 250', desc: 'Torta monumental para eventos especiales', price: 250, cat: 'Eventos' },
    { name: 'Torta Evento Grande 300', desc: 'Torta premium para eventos especiales', price: 300, cat: 'Eventos' },
  ];

  for (const p of productsToInsert) {
    if (!productMap[p.name]) {
      const [res]: any = await conn.query(
        `INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)`,
        [p.name, p.desc, p.price, p.cat]
      );
      productMap[p.name] = res.insertId;
    }
  }
  console.log(`   → Productos disponibles: ${Object.keys(productMap).length}`);

  // Product IDs helpers
  const tortaIds = [1, 2, 3, 4, 5].map(s => productMap[`Torta Tamaño ${s}`]).filter(Boolean);
  const selvaNIds = [2, 3, 4, 5].map(s => productMap[`Selva Negra Tamaño ${s}`]).filter(Boolean);
  const eventIds = [200, 250, 300].map(p => productMap[`Torta Evento Grande ${p}`]).filter(Boolean);
  const eventPrices: Record<number, number> = {};
  if (eventIds[0]) eventPrices[eventIds[0]] = 200;
  if (eventIds[1]) eventPrices[eventIds[1]] = 250;
  if (eventIds[2]) eventPrices[eventIds[2]] = 300;

  // ─── 5. CUSTOMERS (8000) ─────────────────────────────────────────────────────
  console.log('👤 Insertando clientes (8000)...');
  const [existingCustomers]: any = await conn.query(`SELECT COUNT(*) as c FROM customers`);
  let customerIds: number[] = [];
  if (existingCustomers[0].c < 100) {
    const firstNames = ['María', 'Carlos', 'Luis', 'Ana', 'Rosa', 'Pedro', 'Juana', 'Miguel', 'Teresa', 'Jorge',
      'Elena', 'Fernando', 'Patricia', 'Roberto', 'Carmen', 'Ricardo', 'Silvia', 'David', 'Laura', 'Andrés',
      'Valentina', 'Diego', 'Sofia', 'Alejandro', 'Camila', 'Sebastian', 'Isabella', 'Mateo', 'Gabriela', 'Daniel'];
    const lastNames = ['Mamani', 'Quispe', 'Flores', 'Condori', 'Huanca', 'Lima', 'Marca', 'Nina', 'Copa', 'Chura',
      'Morales', 'Tito', 'Ramos', 'Cruz', 'Vargas', 'Salinas', 'Gutierrez', 'Torres', 'Rojas', 'Mendoza',
      'Fernandez', 'Herrera', 'Jimenez', 'Garcia', 'Lopez', 'Martinez', 'Sanchez', 'Romero', 'Vega', 'Ortiz'];

    const batchSize = 500;
    const total = 8000;
    for (let i = 0; i < total; i += batchSize) {
      const batch = [];
      const count = Math.min(batchSize, total - i);
      for (let j = 0; j < count; j++) {
        const fn = pick(firstNames);
        const ln = pick(lastNames);
        const idx = i + j;
        const ci = String(rand(5000000, 9999999));
        const phone = `7${String(rand(1000000, 9999999))}`;
        batch.push([`${fn} ${ln}`, phone, `cliente${idx + 1}@mail.com`, ci]);
      }
      const placeholders = batch.map(() => '(?,?,?,?)').join(',');
      await conn.query(
        `INSERT INTO customers (name, phone, email, ci) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log('   → 8000 clientes insertados');
  } else {
    console.log(`   → Ya existen ${existingCustomers[0].c} clientes, saltando...`);
  }

  const [custRows]: any = await conn.query(`SELECT id FROM customers`);
  customerIds = custRows.map((r: any) => r.id);

  // ─── 6. SUPPLIES ─────────────────────────────────────────────────────────────
  console.log('📦 Insertando insumos...');
  const [existingSupplies]: any = await conn.query(`SELECT COUNT(*) as c FROM supplies`);
  if (existingSupplies[0].c === 0) {
    await conn.query(`INSERT INTO supplies (name, available_amount, unit, expiration_date) VALUES
      ('Harina de trigo', 500, 'kg', '2025-12-01'),
      ('Azúcar', 300, 'kg', '2026-06-01'),
      ('Mantequilla', 200, 'kg', '2025-08-01'),
      ('Huevos', 1000, 'unidad', '2025-05-01'),
      ('Cacao en polvo', 100, 'kg', '2026-01-01'),
      ('Leche condensada', 150, 'latas', '2025-11-01'),
      ('Vainilla', 50, 'litros', '2026-03-01'),
      ('Crema chantilly', 200, 'litros', '2025-07-01'),
      ('Gelatina sin sabor', 30, 'kg', '2026-02-01'),
      ('Frutas variadas', 100, 'kg', '2025-05-15')
    `);
    console.log('   → Insumos insertados');
  } else {
    console.log('   → Insumos ya existentes, saltando...');
  }

  // ─── 7. SALES + ORDERS (5 años) ──────────────────────────────────────────────
  console.log('📊 Generando ventas y reservas (5 años)...\n   Esto puede tardar varios minutos...');

  const [existingSales]: any = await conn.query(`SELECT COUNT(*) as c FROM sales`);
  if (existingSales[0].c > 100) {
    console.log(`   → Ventas ya existen (${existingSales[0].c}), saltando...`);
  } else {
    const paymentMethods = ['Efectivo', 'Tarjeta', 'QR', 'Transferencia'];
    const colors = ['Blanco', 'Rosa', 'Azul', 'Verde', 'Dorado', 'Rojo', 'Lila', 'Beige'];
    const eventTypes = ['Matrimonio', 'Bautizo', 'Cumpleaños', 'Graduación', 'Aniversario', 'Quinceañera'];
    const weddingTypes = ['Matrimonio', 'Matrimonio', 'Matrimonio', 'Matrimonio', 'Matrimonio', 'Bautizo', 'Cumpleaños', 'Aniversario'];

    // Special dates per year
    function getSpecialDates(year: number): Set<string> {
      const s = new Set<string>();
      s.add(`${year}-03-19`); // Día del padre
      s.add(`${year}-05-27`); // Día de la madre
      s.add(`${year}-04-12`); // Día del niño
      s.add(`${year}-09-21`); // Día del estudiante
      // Graduaciones: Nov-Dic Saturdays
      for (let m = 11; m <= 12; m++) {
        const days = new Date(year, m, 0).getDate();
        for (let d = 1; d <= days; d++) {
          const date = new Date(year, m - 1, d);
          if (date.getDay() === 6) { // Saturday
            s.add(`${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
          }
        }
      }
      return s;
    }

    let totalSales = 0;
    let totalOrders = 0;

    for (let year = 2020; year <= 2025; year++) {
      const maxMonth = year === 2025 ? 4 : 12;
      const specialDates = getSpecialDates(year);
      console.log(`   📅 Procesando año ${year}...`);

      for (let month = 1; month <= maxMonth; month++) {
        const daysInMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          if (year === 2025 && month === 4 && day > 7) break;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dateObj = new Date(year, month - 1, day);
          const dow = dateObj.getDay(); // 0=Dom, 6=Sáb
          const isSaturday = dow === 6;
          const isSunday = dow === 0;
          const isSpecial = specialDates.has(dateStr);
          const isFathersMother = dateStr === `${year}-03-19` || dateStr === `${year}-05-27`;
          const isKidsStudents = dateStr === `${year}-04-12` || dateStr === `${year}-09-21`;
          const isGraduation = (month === 11 || month === 12) && isSaturday;

          const branch = pick(branchIds);
          const emp = pick(empIds);

          // ─── VENTAS NORMALES DEL DÍA ───
          if (!isSunday) {
            let dailySalesTarget = 3000;
            if (isFathersMother) dailySalesTarget = dateStr.includes('03-19') ? 20000 : 30000;
            else if (isKidsStudents && !isSaturday) dailySalesTarget = rand(5000, 8000); // partial from events
            else if (isSaturday && !isGraduation) dailySalesTarget = rand(2000, 4000);

            let accumulated = 0;
            let iterations = 0;
            while (accumulated < dailySalesTarget && iterations < 150) {
              iterations++;
              const custId = pick(customerIds);
              // Pick a torta size (weighted towards smaller)
              const sizeIdx = Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : Math.random() < 0.3 ? 3 : 4;
              const productId = tortaIds[sizeIdx];
              if (!productId) continue;
              const unitPrice = tortaPrice(sizeIdx + 1, year);
              const qty = rand(1, 3);
              const subtotal = parseFloat((unitPrice * qty).toFixed(2));

              const saleDate = dateAt(year, month, day);
              const [saleRes]: any = await conn.query(
                `INSERT INTO sales (sale_date, customer_id, employee_id, branch_id, total, payment_method) VALUES (?, ?, ?, ?, ?, ?)`,
                [saleDate, custId, emp, branch, subtotal, pick(paymentMethods)]
              );
              await conn.query(
                `INSERT INTO sale_products (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)`,
                [saleRes.insertId, productId, qty, unitPrice, subtotal]
              );
              accumulated += subtotal;
              totalSales++;
            }

            // Selva Negra: ~20% chance random days
            if (Math.random() < 0.2) {
              const snSize = pick([0, 1, 2, 3]);
              const snId = selvaNIds[snSize];
              if (snId) {
                const snPrice = selvaNegraPrice(snSize + 2, year);
                const qty = 1;
                const saleDate = dateAt(year, month, day);
                const [saleRes]: any = await conn.query(
                  `INSERT INTO sales (sale_date, customer_id, employee_id, branch_id, total, payment_method) VALUES (?, ?, ?, ?, ?, ?)`,
                  [saleDate, pick(customerIds), emp, branch, snPrice, pick(paymentMethods)]
                );
                await conn.query(
                  `INSERT INTO sale_products (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)`,
                  [saleRes.insertId, snId, qty, snPrice, snPrice]
                );
                totalSales++;
              }
            }
          }

          // ─── RESERVAS SÁBADOS (Matrimonios, etc.) ───
          if (isSaturday && !isGraduation) {
            const numOrders = rand(5, 12);
            for (let o = 0; o < numOrders; o++) {
              const custId = pick(customerIds);
              const evType = pick(weddingTypes);
              const eventProdId = pick(eventIds);
              const eventPrice = eventPrices[eventProdId];
              const advance = parseFloat((eventPrice * randFloat(0.3, 0.5)).toFixed(2));
              const orderDate = dateAt(year, month, day, 8);
              const [orderRes]: any = await conn.query(
                `INSERT INTO orders (branch_id, employee_id, customer_id, delivery_date, color, price, pieces, specifications, advance, event_type, type, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'GRANDE', 'DELIVERED')`,
                [branch, emp, custId, orderDate, pick(colors), eventPrice, rand(1, 3),
                 `${evType} especial - personalizado`, advance, evType]
              );
              await conn.query(
                `INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)`,
                [orderRes.insertId, eventProdId, 1]
              );
              totalOrders++;
            }
          }

          // ─── RESERVAS GRADUACIONES (Nov-Dic Sábados) ───
          if (isGraduation) {
            const numOrders = rand(3, 8);
            for (let o = 0; o < numOrders; o++) {
              const custId = pick(customerIds);
              const evType = rand(0, 1) === 0 ? 'Graduación Universitaria' : 'Salida Militar';
              const eventProdId = pick(eventIds);
              const eventPrice = eventPrices[eventProdId];
              const advance = parseFloat((eventPrice * randFloat(0.3, 0.5)).toFixed(2));
              const orderDate = dateAt(year, month, day, 8);
              const [orderRes]: any = await conn.query(
                `INSERT INTO orders (branch_id, employee_id, customer_id, delivery_date, color, price, pieces, specifications, advance, event_type, type, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'GRANDE', 'DELIVERED')`,
                [branch, emp, custId, orderDate, pick(colors), eventPrice, rand(1, 2),
                 `${evType} - Pedido especial`, advance, evType]
              );
              await conn.query(
                `INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)`,
                [orderRes.insertId, eventProdId, 1]
              );
              totalOrders++;
            }

            // También ventas en días de graduación: 15000-20000
            let gradAccum = 0;
            while (gradAccum < rand(15000, 20000)) {
              const custId = pick(customerIds);
              const eventProdId = pick(eventIds);
              const eventPrice = eventPrices[eventProdId];
              const saleDate = dateAt(year, month, day);
              const [saleRes]: any = await conn.query(
                `INSERT INTO sales (sale_date, customer_id, employee_id, branch_id, total, payment_method) VALUES (?, ?, ?, ?, ?, ?)`,
                [saleDate, custId, emp, branch, eventPrice, pick(paymentMethods)]
              );
              await conn.query(
                `INSERT INTO sale_products (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)`,
                [saleRes.insertId, eventProdId, 1, eventPrice, eventPrice]
              );
              gradAccum += eventPrice;
              totalSales++;
            }
          }

          // ─── Día del Niño y Estudiante: Reservas de eventos especiales ──
          if (isKidsStudents) {
            const numBigOrders = rand(5, 10);
            let bigAccum = 0;
            for (let o = 0; o < numBigOrders; o++) {
              const custId = pick(customerIds);
              const eventProdId = pick(eventIds);
              const eventPrice = eventPrices[eventProdId];
              const advance = parseFloat((eventPrice * randFloat(0.3, 0.5)).toFixed(2));
              const orderDate = dateAt(year, month, day, 8);
              const evType = dateStr.includes('04-12') ? 'Día del Niño' : 'Día del Estudiante';
              const [orderRes]: any = await conn.query(
                `INSERT INTO orders (branch_id, employee_id, customer_id, delivery_date, color, price, pieces, specifications, advance, event_type, type, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'GRANDE', 'DELIVERED')`,
                [branch, emp, custId, orderDate, pick(colors), eventPrice, 1,
                 `${evType} - Pedido especial`, advance, evType]
              );
              await conn.query(
                `INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)`,
                [orderRes.insertId, eventProdId, 1]
              );
              bigAccum += eventPrice;
              totalOrders++;
            }
            // Ensure range 15000-20000
            while (bigAccum < 15000) {
              const eventProdId = pick(eventIds);
              const eventPrice = eventPrices[eventProdId];
              const saleDate = dateAt(year, month, day);
              const [saleRes]: any = await conn.query(
                `INSERT INTO sales (sale_date, customer_id, employee_id, branch_id, total, payment_method) VALUES (?, ?, ?, ?, ?, ?)`,
                [saleDate, pick(customerIds), emp, branch, eventPrice, pick(paymentMethods)]
              );
              await conn.query(
                `INSERT INTO sale_products (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)`,
                [(saleRes as any).insertId, eventProdId, 1, eventPrice, eventPrice]
              );
              bigAccum += eventPrice;
              totalSales++;
            }
          }

          // ─── Gastos mensuales: primer día del mes ───
          if (day === 1) {
            await conn.query(
              `INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)`,
              [`Suministros mensuales - ${dateStr}`, randFloat(1500, 3000), dateStr]
            );
            await conn.query(
              `INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)`,
              [`Servicios agua/luz - ${dateStr}`, randFloat(300, 700), dateStr]
            );
          }
        }
      }
      console.log(`   ✅ Año ${year} completo`);
    }
    console.log(`\n   → ${totalSales} ventas generadas`);
    console.log(`   → ${totalOrders} reservas generadas`);
  }

  // ─── 8. PRODUCTION ───────────────────────────────────────────────────────────
  console.log('\n🏭 Insertando producción...');
  const [existingProd]: any = await conn.query(`SELECT COUNT(*) as c FROM production`);
  if (existingProd[0].c === 0) {
    const prodBatch: any[] = [];
    for (let year = 2020; year <= 2025; year++) {
      const maxMonth = year === 2025 ? 4 : 12;
      for (let month = 1; month <= maxMonth; month++) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day += 3) {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const prodEmp = empIds[rand(1, 5)];
          for (const pid of tortaIds.slice(0, 3)) {
            if (pid) prodBatch.push([pid, rand(10, 30), dateStr, prodEmp]);
          }
        }
      }
    }
    for (let i = 0; i < prodBatch.length; i += 500) {
      const batch = prodBatch.slice(i, i + 500);
      const placeholders = batch.map(() => '(?,?,?,?)').join(',');
      await conn.query(
        `INSERT INTO production (product_id, produced_quantity, production_date, employee_id) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log(`   → ${prodBatch.length} lotes de producción insertados`);
  } else {
    console.log('   → Producción ya existente, saltando...');
  }

  // ─── 9. BRANCH DISTRIBUTIONS ─────────────────────────────────────────────────
  console.log('🚚 Insertando distribuciones...');
  const [existingDist]: any = await conn.query(`SELECT COUNT(*) as c FROM branch_distributions`);
  if (existingDist[0].c === 0 && branchIds.length > 1) {
    const distBatch: any[] = [];
    for (let year = 2020; year <= 2025; year++) {
      const maxMonth = year === 2025 ? 4 : 12;
      for (let month = 1; month <= maxMonth; month++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-05`;
        for (const pid of tortaIds.slice(0, 3)) {
          if (pid) {
            const destBranch = branchIds[rand(0, branchIds.length - 1)];
            distBatch.push([pid, rand(20, 60), destBranch, dateStr]);
          }
        }
      }
    }
    for (let i = 0; i < distBatch.length; i += 300) {
      const batch = distBatch.slice(i, i + 300);
      const placeholders = batch.map(() => '(?,?,?,?)').join(',');
      await conn.query(
        `INSERT INTO branch_distributions (product_id, quantity, destination_branch, shipping_date) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log(`   → ${distBatch.length} distribuciones insertadas`);
  } else {
    console.log('   → Distribuciones ya existentes o sin sucursales suficientes, saltando...');
  }

  // ─── 10. INCOMES (Ingresos anuales de referencia) ────────────────────────────
  console.log('💵 Insertando ingresos de referencia...');
  const [existingIncomes]: any = await conn.query(`SELECT COUNT(*) as c FROM incomes`);
  if (existingIncomes[0].c === 0) {
    const incomeRows: any[] = [];
    for (let year = 2020; year <= 2025; year++) {
      const maxMonth = year === 2025 ? 4 : 12;
      for (let month = 1; month <= maxMonth; month++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;
        incomeRows.push([`Ingresos ventas mes ${month}/${year}`, randFloat(60000, 100000), dateStr]);
      }
    }
    const placeholders = incomeRows.map(() => '(?,?,?)').join(',');
    await conn.query(
      `INSERT INTO incomes (description, amount, date) VALUES ${placeholders}`,
      incomeRows.flat()
    );
    console.log(`   → ${incomeRows.length} registros de ingresos insertados`);
  } else {
    console.log('   → Ingresos ya existentes, saltando...');
  }

  // ─── 11. ATTENDANCE (Últimos 6 meses) ────────────────────────────────────────
  console.log('📋 Insertando asistencia de los últimos 6 meses...');
  const [existingAtt]: any = await conn.query(`SELECT COUNT(*) as c FROM attendance`);
  if (existingAtt[0].c < 100) {
    const attBatch: any[] = [];
    const today = new Date();
    for (let dAgo = 180; dAgo >= 0; dAgo--) {
      const d = new Date(today);
      d.setDate(d.getDate() - dAgo);
      if (d.getDay() === 0) continue; // skip Sundays
      const dateStr = d.toISOString().split('T')[0];
      for (const uid of empIds) {
        const present = Math.random() < 0.9;
        const late = present && Math.random() < 0.1;
        const entryTime = present ? (late ? '08:30:00' : '08:00:00') : null;
        const exitTime = present ? '17:00:00' : null;
        attBatch.push([uid, dateStr, entryTime, exitTime]);
      }
    }
    for (let i = 0; i < attBatch.length; i += 500) {
      const batch = attBatch.slice(i, i + 500);
      const placeholders = batch.map(() => '(?,?,?,?)').join(',');
      await conn.query(
        `INSERT INTO attendance (user_id, date, entry_time, exit_time) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log(`   → ${attBatch.length} registros de asistencia insertados`);
  } else {
    console.log('   → Asistencia ya existente, saltando...');
  }

  // ─── 12. BONUSES ─────────────────────────────────────────────────────────────
  console.log('🎁 Insertando bonos anuales...');
  const [existingBonuses]: any = await conn.query(`SELECT COUNT(*) as c FROM bonuses`);
  if (existingBonuses[0].c === 0) {
    const bonusBatch: any[] = [];
    for (let year = 2020; year <= 2024; year++) {
      for (const uid of empIds) {
        bonusBatch.push([uid, year, 700, true, `${year}-12-31`]);
      }
    }
    for (let i = 0; i < bonusBatch.length; i += 200) {
      const batch = bonusBatch.slice(i, i + 200);
      const placeholders = batch.map(() => '(?,?,?,?,?)').join(',');
      await conn.query(
        `INSERT INTO bonuses (employee_id, year, annual_bonus, paid, paid_date) VALUES ${placeholders}`,
        batch.flat()
      );
    }
    console.log(`   → ${bonusBatch.length} bonos anuales insertados`);
  } else {
    console.log('   → Bonos ya existentes, saltando...');
  }

  await conn.end();
  console.log('\n🎉 ¡Seed completado exitosamente!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
