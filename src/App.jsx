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
    const confirmDelete = confirm('¿Seguro que deseas eliminar este ticket?');

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
      <section className="hero">
        <p className="eyebrow">Proyecto Entry / Jr</p>
        <h1>Sistema de Tickets de Soporte TI</h1>
        <p>
          Aplicación web para registrar, consultar y dar seguimiento a tickets
          de soporte técnico.
        </p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total</span>
          <strong>{totalTickets}</strong>
        </article>

        <article className="stat-card">
          <span>Abiertos</span>
          <strong>{openTickets}</strong>
        </article>

        <article className="stat-card">
          <span>En proceso</span>
          <strong>{inProgressTickets}</strong>
        </article>

        <article className="stat-card">
          <span>Cerrados</span>
          <strong>{closedTickets}</strong>
        </article>
      </section>

      <section className="content-grid">
        <form className="ticket-form" onSubmit={handleSubmit}>
          <h2>Registrar ticket</h2>

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

          <label>
            Descripción del problema
            <textarea
              name="issue"
              value={form.issue}
              onChange={handleChange}
              placeholder="Describe el problema del usuario..."
              rows="5"
            />
          </label>

          <button type="submit">Guardar ticket</button>
        </form>

        <section className="tickets-section">
          <div className="section-header">
            <div>
              <h2>Tickets registrados</h2>
              <p>Consulta, filtra y actualiza el estado de cada solicitud.</p>
            </div>
          </div>

          <div className="filters">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, área o problema..."
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
              <h3>No hay tickets para mostrar</h3>
              <p>Registra un ticket o cambia los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Solicitante</th>
                    <th>Área</th>
                    <th>Problema</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.requester}</td>
                      <td>{ticket.department}</td>
                      <td>{ticket.issue}</td>
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
    </main>
  );
}

export default App;