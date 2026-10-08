import type { Metadata } from "next";
import { company } from "@/content/properties";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "What information Three Star Towers collects through its website and mobile app, and why.",
};

// Plain-language draft. Have it reviewed against the Kenya Data Protection Act, 2019 before relying on it.
export default function Privacy() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Privacy</span>
          <h1>
            Privacy <em>notice</em>
          </h1>
          <p>What we collect through this website and the Three Star Towers app, and what we do with it.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container prose">
          <h2>What we collect</h2>
          <ul>
            <li>
              <b>Your name and phone number</b>, when you enter them in the app or in an enquiry form, together with the
              residence you asked about and any message you add.
            </li>
            <li>
              <b>Basic app usage</b>: a random identifier created when the app is installed, your phone type (Android
              or iPhone), the app version, and which residences are opened. This does not include your location,
              contacts or any other information from your phone.
            </li>
          </ul>
          <h2>Why we collect it</h2>
          <p>
            We use your name and number to contact you about the residences you are interested in. We use the usage
            figures to understand how many people use the app and which residences attract interest.
          </p>
          <h2>Who sees it</h2>
          <p>
            Your details are seen by {company.name} and its sales partner, Heimat Consult Ltd. We do not sell your
            information or share it with anyone else for marketing.
          </p>
          <h2>Your choices</h2>
          <p>
            You can ask us to show you, correct or delete the information we hold about you at any time by emailing{" "}
            <a href={`mailto:${company.emails[1]}`}>{company.emails[1]}</a> or calling {company.phones[0]}.
          </p>
        </div>
      </section>
    </>
  );
}
