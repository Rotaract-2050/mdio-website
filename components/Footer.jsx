import React from 'react';
import './Footer.css';
import site from '../content/site.json';

const Footer = ({ bgColor = 'var(--cranberry)', textColor = '#fff', borderTop = 'none' }) => {
  const { title, subtitle, columns, bottom } = site.footer;
  return (
    <footer className="mdio-footer" style={{ background: bgColor, color: textColor, borderTop }}>
      <div className="mdio-footer-big">
        {title}<br />
        <span>{subtitle}</span>
      </div>
      <div className="mdio-footer-grid">
        {columns.map((col) => (
          <div key={col.heading}>
            <div className="mdio-fh">{col.heading}</div>
            {col.links.map((l, i) => (
              <a key={i} href={l.href}>{l.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="mdio-footer-bottom">
        {bottom.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
