import React from 'react';
import EventClosed from './EventClosed';
import site from '../content/site.json';

// Sezione "CTA APERTURA NAZIONALE" condivisa da home e pagine distretto.
// `starText` e `button` cambiano tra home e distretti (spaziatura ✦ e testo/link del bottone).
// `thanks` (solo home) sostituisce sopratitolo e riquadro "evento concluso".
const EventBanner = ({ starText, button, thanks }) => {
  const { ticker, eyebrow, titleLines, emph } = site.event;
  return (
    <section className="vb-event">
      <div className="vb-event-marquee">
        <div className="vb-event-track">
          {[0, 1].map((i) => (
            <React.Fragment key={i}>
              <span>{ticker[0]}</span>
              <span className="vb-event-star">{starText}</span>
              <span>{ticker[1]}</span>
              <span className="vb-event-star">{starText}</span>
              <span>{ticker[2]}</span>
              <span className="vb-event-star">{starText}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="vb-event-body">
        <div className="vb-event-left">
          <div className="vb-event-eyebrow">{thanks ? thanks.eyebrow : eyebrow}</div>
          <h2 className="vb-event-title">
            {titleLines.map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
            <span className="vb-event-emph">{emph}</span>
          </h2>
          <a href={button.href} className="vb-btn-block">{button.text}</a>
        </div>
        <div className="vb-event-right">
          <EventClosed label={thanks ? thanks.label : undefined} />
        </div>
      </div>
    </section>
  );
};

export default EventBanner;
