import React from "react";
import styles from "../about.module.css";

const teamMembers = [
  {
    name: "Nicholas Parise",
    role: "Product Owner & Backend Developer",
    image: "assets/about/nick.jpg",
    contributions: [
      "Entire backend API development",
      "Managed deployment and server infrastructure",
      "Oversaw overall system architecture"
    ]
  },
  {
    name: "Geoffrey Jensen",
    role: "Scrum Master & Frontend Developer",
    image: "assets/about/geoff.jpg",
    contributions: [
      "Developed the Wishlist page",
      "Wrote comprehensive pytest test suites for the API",
      "Coordinated team meetings and sprint planning"
    ]
  },
  {
    name: "Stephen Stefanidis",
    role: "Frontend Developer",
    image: "assets/about/stephen.jpg",
    contributions: [
      "Built the list of wishlists page",
      "Implemented the list of events page",
      "created the Ideas page"
    ]
  },
  {
    name: "Justin Bijoy",
    role: "Lead Documentation & UI Designer",
    image: "assets/about/justin.jpg",
    contributions: [
      "Designed and built the landing page",
      "Created UI components and site-wide CSS styling",
      "Maintained technical and user-facing documentation"
    ]
  },
  {
    name: "Anthony Medico",
    role: "Frontend Developer",
    image: "assets/about/Anthony.png",
    contributions: [
      "Created the login and signup pages",
      "Implemented the user profile pages",
      "Contributed to category-related UI features"
    ]
  },
  {
    name: "Ethan Brennan",
    role: "Developer",
    image: "/assets/placeholder-avatar.png",
    contributions: [
      "Edited the Home page and created Help menu",
    ]
  }
];

const About = () => {
    return (
        <section className={styles.container}>
          <h1 className={styles.heading}>Meet the Wishify Team</h1>
          <p className={styles.subheading}>
            We're a team of student developers who came together to build Wishify — a wishlist app designed to make gift-giving smarter and easier.
          </p>
          <div className={styles.grid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.card}>
                <img src={member.image} alt={member.name} className={styles.image} />
                <div className={styles.info}>
                  <h2 className={styles.name}>{member.name}</h2>
                  <p className={styles.role}><strong>{member.role}</strong></p>
                  <ul className={styles.list}>
                    {member.contributions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
};

export default About;