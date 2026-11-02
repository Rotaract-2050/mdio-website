import React from 'react';
import site from '../content/site.json';

// Stato statico dell'evento concluso (sostituisce il vecchio conto alla rovescia).
// Il testo viene da content/site.json (campo closedLabel), salvo `label` esplicito.
// Il separatore " · " diventa un a capo: evita il "·" orfano a fine riga su schermi stretti.
const EventClosed = ({ label = site.closedLabel }) => (
  <div className="vb-closed">
    {String(label).split(' · ').map((part, i) => (
      <React.Fragment key={i}>{i > 0 && <br />}{part}</React.Fragment>
    ))}
  </div>
);

export default EventClosed;
