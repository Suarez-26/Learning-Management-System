/* =====================================================
   LMS ABC — delete.js
   Lógica de eliminación con confirmación
   ===================================================== */

function confirmDelete(type, id) {
  const msgs = {
    docente: '¿Eliminar este docente? Esta acción no se puede deshacer.',
    curso:   '¿Eliminar este curso? También se eliminarán sus módulos y lecciones.',
    modulo:  '¿Eliminar este módulo? También se eliminarán sus lecciones.',
    leccion: '¿Eliminar esta lección?',
    admin:   '¿Eliminar este administrativo?',
  };
  document.getElementById('confirm-message').textContent = msgs[type] || '¿Confirmar eliminación?';
  document.getElementById('confirm-action-btn').onclick  = () => doDelete(type, id);
  openModal('modal-confirm');
}

function doDelete(type, id) {
  switch (type) {

    case 'docente': {
      const cursos = LS.get('cursos');
      if (cursos.some(c => c.docenteId === id)) {
        closeModal('modal-confirm');
        toast('⚠️ No puedes eliminar un docente con cursos asignados', 'error');
        return;
      }
      LS.set('docentes', LS.get('docentes').filter(d => d.id !== id));
      renderDocentes();
      break;
    }

    case 'curso': {
      const modulos    = LS.get('modulos').filter(m => m.cursoId === id);
      const moduloIds  = modulos.map(m => m.id);
      LS.set('lecciones', LS.get('lecciones').filter(l => !moduloIds.includes(l.moduloId)));
      LS.set('modulos',   LS.get('modulos').filter(m => m.cursoId !== id));
      LS.set('cursos',    LS.get('cursos').filter(c => c.id !== id));
      renderCursos();
      populateCursoSelect();
      renderModulos();
      break;
    }

    case 'modulo': {
      LS.set('lecciones', LS.get('lecciones').filter(l => l.moduloId !== id));
      LS.set('modulos',   LS.get('modulos').filter(m => m.id !== id));
      renderModulos();
      break;
    }

    case 'leccion': {
      LS.set('lecciones', LS.get('lecciones').filter(l => l.id !== id));
      renderModulos();
      break;
    }

    case 'admin': {
      LS.set('admins', LS.get('admins').filter(a => a.id !== id));
      renderAdmins();
      break;
    }
  }

  closeModal('modal-confirm');
  updateDashboard();
  toast('Eliminado correctamente', 'success');
}
