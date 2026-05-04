import { useEffect, useMemo, useState } from 'react';
import './index.css';

const initialForm = {
  requester: '',
  department: '',
  issue: '',
  priority: 'Media',
};

function App() {
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [priorityFilter, setPriorityFilter] = useState('Todas');

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.requester.trim() || !form.department.trim() || !form.issue.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const newTicket = {
      id: Date.now(),
      requester: form.requester.trim(),
      department: form.department.trim(),
      issue: form.issue.trim(),
      priority: form.priority,
      status: 'Abierto',
      createdAt: new Date().toLocaleString('es-MX'),
    };

    setTickets([newTicket, ...tickets]);
    setForm(initialForm);
  };

  const updateStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    );

    setTickets(updatedTickets);
  };

  const deleteTicket = (ticketId) => {
    const confirmDelete = confirm('¿Seguro que deseas eliminar esta solicitud?');

    if (!confirmDelete) return;

    const filteredTickets = tickets.filter((ticket) => ticket.id !== ticketId);
    setTickets(filteredTickets);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        ticket.requester.toLowerCase().includes(searchText) ||
        ticket.department.toLowerCase().includes(searchText) ||
        ticket.issue.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'Todos' || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'Todas' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((ticket) => ticket.status === 'Abierto').length;
  const inProgressTickets = tickets.filter((ticket) => ticket.status === 'En proceso').length;
  const closedTickets = tickets.filter((ticket) => ticket.status === 'Cerrado').length;

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <span className="system-label">Mesa de ayuda TI</span>
          <h1>Seguimiento de solicitudes</h1>
        </div>

        <div className="topbar-user">
          <span>Panel interno</span>
          <strong>Soporte</strong>
        </div>
      </header>

      <section className="layout">
        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>Módulo de soporte</h2>
            <p>
              Registro básico de incidencias reportadas por usuarios internos.
            </p>
          </div>

          <div className="summary-list">
            <div>
              <span>Total</span>
              <strong>{totalTickets}</strong>
            </div>

            <div>
              <span>Abiertas</span>
              <strong>{openTickets}</strong>
            </div>

            <div>
              <span>En proceso</span>
              <strong>{inProgressTickets}</strong>
            </div>

            <div>
              <span>Cerradas</span>
              <strong>{closedTickets}</strong>
            </div>
          </div>

          <div className="note-box">
            <strong>Objetivo</strong>
            <p>
              Mantener un control sencillo de reportes, prioridades y estados
              de atención.
            </p>
          </div>
        </aside>

        <section className="main-content">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Nueva solicitud</h2>
                <p>Captura los datos principales del reporte.</p>
              </div>
            </div>

            <form className="ticket-form" onSubmit={handleSubmit}>
              <label>
                Nombre del solicitante
                <input
                  type="text"
                  name="requester"
                  value={form.requester}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                />
              </label>

              <label>
                Área o departamento
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un área</option>
                  <option value="Administración">Administración</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Sistemas">Sistemas</option>
                  <option value="Contabilidad">Contabilidad</option>
                </select>
              </label>

              <label>
                Prioridad
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </label>

              <label className="full-width">
                Descripción del problema
                <textarea
                  name="issue"
                  value={form.issue}
                  onChange={handleChange}
                  placeholder="Ej. El usuario no puede ingresar al sistema..."
                  rows="4"
                />
              </label>

              <div className="form-actions">
                <button type="submit">Registrar solicitud</button>
              </div>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Solicitudes registradas</h2>
                <p>Consulta, filtra y actualiza el estado de atención.</p>
              </div>
            </div>

            <div className="filters">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, área o problema"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Abierto">Abierto</option>
                <option value="En proceso">En proceso</option>
                <option value="Cerrado">Cerrado</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="Todas">Todas las prioridades</option>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="empty-state">
                <strong>No hay solicitudes para mostrar</strong>
                <p>Registra una solicitud o modifica los filtros de búsqueda.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Solicitante</th>
                      <th>Área</th>
                      <th>Problema</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>#{String(ticket.id).slice(-5)}</td>
                        <td>{ticket.requester}</td>
                        <td>{ticket.department}</td>
                        <td className="issue-cell">{ticket.issue}</td>
                        <td>
                          <span className={`badge priority-${ticket.priority.toLowerCase()}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={ticket.status}
                            onChange={(event) =>
                              updateStatus(ticket.id, event.target.value)
                            }
                          >
                            <option value="Abierto">Abierto</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Cerrado">Cerrado</option>
                          </select>
                        </td>
                        <td>{ticket.createdAt}</td>
                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => deleteTicket(ticket.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;