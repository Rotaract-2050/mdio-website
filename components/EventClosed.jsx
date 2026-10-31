import React from 'react';
import site from '../content/site.json';

// Stato statico dell'evento concluso (sostituisce il vecchio conto alla rovescia).
// Il testo viene da content/site.json (campo closedLabel), salvo `label` esplicito.
const EventClosed = ({ label = site.closedLabel }) => (
  <div className="vb-closed">{label}</div>
);

export default EventClosed;
