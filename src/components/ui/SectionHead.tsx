type Props = {
  id: string;
  index: string;
  label: string;
  lead: string; // heading text before the accent word
  accent: string; // single italic Instrument Serif word, in --mute
};

/** Mono index + label tag above a heading that ends in one italic accent word. */
export function SectionHead({ id, index, label, lead, accent }: Props) {
  return (
    <header className="sh">
      <p className="tag mono rv">
        <span>{index}</span>
        <span aria-hidden="true" className="sh-dash">—</span>
        <span>{label}</span>
      </p>
      <h2 id={id} className="h2 sh-title">
        <span className="rv-mask">
          <span>
            {lead} <em>{accent}</em>
          </span>
        </span>
      </h2>
    </header>
  );
}
