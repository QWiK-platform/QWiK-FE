import React from "react";
import { useParams } from "react-router-dom";
import privacyPolicy from "../data/terms/privacyPolicy";
import repositoryAccess from "../data/terms/repositoryAccess";
import serviceTerms from "../data/terms/serviceTerm";
import "./Term.css";

const TERMS_DATA = {
  privacy: privacyPolicy,
  repository: repositoryAccess,
  service: serviceTerms,
};

const Term = () => {
  const { type } = useParams();
  const termData = TERMS_DATA[type];

  if (!termData) {
    return <div>약관을 찾을 수 없습니다.</div>;
  }

  return (
    <section className="term-section">
      <div className="wrap">
        <div className="term-header">
          <h4>{termData.title}</h4>
          {termData.subtitle && (
            <p className="term-subtitle">{termData.subtitle}</p>
          )}
          <div className="term-dates">
            <p>최종 수정일: {termData.lastUpdated}</p>
            <p>시행일: {termData.effectiveDate}</p>
          </div>
        </div>
        <div className="term-content">
          {termData.sections.map((section) => (
            <div key={section.id} className="term-section-item">
              <h5 className="term-section-title">{section.title}</h5>
              <div className="term-section-content">
                <pre>{section.content}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Term;
