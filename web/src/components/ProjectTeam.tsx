import Image from "next/image";
import Logo from "./Logo";
import { projectTeam, type TeamMember } from "@/content/properties";

type Kind = TeamMember["details"][number]["kind"];

const icons: Record<Kind, React.ReactNode> = {
  place: (
    <>
      <path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21z" />
      <circle cx="12" cy="10.500" r="2.300" />
    </>
  ),
  post: (
    <>
      <rect x="3.500" y="6" width="17" height="12" rx="2" />
      <path d="M4 7.500l8 6 8-6" />
    </>
  ),
  email: (
    <>
      <rect x="3.500" y="6" width="17" height="12" rx="2" />
      <path d="M4 7.500l8 6 8-6" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M3.500 12h17M12 3.500c2.600 2.400 2.600 14.600 0 17M12 3.500c-2.600 2.400-2.600 14.600 0 17" />
    </>
  ),
  phone: (
    <path d="M6.500 4h3l1.500 4-2 1.500a11 11 0 0 0 5.500 5.500l1.500-2 4 1.500v3a1.500 1.500 0 0 1-1.500 1.500A14.500 14.500 0 0 1 5 5.500 1.500 1.500 0 0 1 6.500 4z" />
  ),
};

const href = (kind: Kind, text: string) => {
  if (kind === "email") return `mailto:${text}`;
  if (kind === "web") return `https://${text}`;
  return undefined;
};

export default function ProjectTeam() {
  return (
    <div className="team">
      {projectTeam.map((member, i) => (
        <article key={member.role} className={`team__card${i === 1 ? " team__card--light" : ""}`} data-reveal style={{ transitionDelay: `${i * 110}ms` }}>
          <h3>{member.role}</h3>
          <div className="team__logo">
            {member.logo === "tst" ? (
              <>
                <Logo light={i !== 1} />
                <span>
                  Three Star Towers
                  <br />
                  Limited
                </span>
              </>
            ) : (
              <Image src={`/images/${member.logo}.png`} alt={member.name} width={220} height={71} />
            )}
          </div>
          <ul>
            {member.details.map((d) => {
              const link = href(d.kind, d.text);
              return (
                <li key={d.kind + d.text}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.500" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icons[d.kind]}
                  </svg>
                  {link ? <a href={link}>{d.text}</a> : <span>{d.text}</span>}
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  );
}
