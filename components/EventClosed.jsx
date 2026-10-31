import React from 'react';
import site from '../content/site.json';

// Stato statico dell'evento concluso (sostituisce il vecchio conto alla rovescia).
// Il testo viene da content/site.json (campo closedLabel).
const EventClosed = () => (
  <div className="vb-closed">{site.closedLabel}</div>
);

export default EventClosed;
