/* =====================================================
   LMS ABC — data.js
   Capa de datos con localStorage
   ===================================================== */

const LS = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};

/**
 * Inicializa datos de muestra si es la primera vez
 */
function initData() {
  if (localStorage.getItem('lms_initialized')) return;

  // ---- Administrativos ----
  LS.set('admins', [
    {
      id: 'ADM-001', identificacion: '11111111',
      nombres: 'Super', apellidos: 'Admin',
      email: 'admin@abc.edu.co', pass: 'admin123',
      telefono: '3001234567', cargo: 'Rector'
    }
  ]);

  // ---- Docentes ----
  LS.set('docentes', [
    { id: 'DOC-001', codigo: 'DOC-001', identificacion: '22222222', nombres: 'Carlos',  apellidos: 'Mendoza', email: 'cmendoza@abc.edu.co', area: 'Informática',  foto: '' },
    { id: 'DOC-002', codigo: 'DOC-002', identificacion: '33333333', nombres: 'Laura',   apellidos: 'Torres',  email: 'ltorres@abc.edu.co',  area: 'Matemáticas', foto: '' },
    { id: 'DOC-003', codigo: 'DOC-003', identificacion: '44444444', nombres: 'Pedro',   apellidos: 'Ramírez', email: 'pramirez@abc.edu.co', area: 'Biología',     foto: '' },
  ]);

  // ---- Cursos ----
  LS.set('cursos', [
    { id: 'CUR-001', codigo: 'CUR-001', nombre: 'Introducción a la Programación', descripcion: 'Fundamentos de programación con Python y JavaScript para principiantes.', docenteId: 'DOC-001' },
    { id: 'CUR-002', codigo: 'CUR-002', nombre: 'Cálculo Diferencial',            descripcion: 'Estudio de límites, derivadas e integrales aplicadas a problemas reales.',  docenteId: 'DOC-002' },
    { id: 'CUR-003', codigo: 'CUR-003', nombre: 'Biología Celular',               descripcion: 'Exploración de la célula, su estructura, funciones y procesos vitales.',     docenteId: 'DOC-003' },
  ]);

  // ---- Módulos ----
  LS.set('modulos', [
    { id: 'MOD-001', codigo: 'MOD-001', cursoId: 'CUR-001', nombre: 'Módulo 1: Fundamentos',    descripcion: 'Variables, tipos de datos y estructuras básicas.' },
    { id: 'MOD-002', codigo: 'MOD-002', cursoId: 'CUR-001', nombre: 'Módulo 2: Control de Flujo', descripcion: 'Condicionales y bucles.' },
    { id: 'MOD-003', codigo: 'MOD-003', cursoId: 'CUR-002', nombre: 'Módulo 1: Límites',         descripcion: 'Concepto y cálculo de límites.' },
  ]);

  // ---- Lecciones ----
  LS.set('lecciones', [
    { id: 'LEC-001', moduloId: 'MOD-001', titulo: 'Variables y Tipos de Datos', horas: 2, contenido: 'En esta lección aprenderás qué son las variables y cómo declararlas.', multimedia: [{ tipo: 'video', url: 'https://youtube.com' }] },
    { id: 'LEC-002', moduloId: 'MOD-001', titulo: 'Operadores',                  horas: 1, contenido: 'Operadores aritméticos, lógicos y de comparación.',                   multimedia: [] },
    { id: 'LEC-003', moduloId: 'MOD-002', titulo: 'Condicionales if/else',       horas: 2, contenido: 'Estructuras de decisión.',                                             multimedia: [{ tipo: 'pdf', url: 'https://drive.google.com' }] },
  ]);

  localStorage.setItem('lms_initialized', '1');
}
