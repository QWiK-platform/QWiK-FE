import React from "react";
import "./Index.css";

const Index = () => {
  const indexDeploymentsList = [
    {
      id: 1,
      sortId: 1,
      name: "choose-yours",
      resource: 43,
    },
    {
      id: 2,
      sortId: 2,
      name: "pick-any",
      resource: 56,
    },
    {
      id: 3,
      sortId: 3,
      name: "your-choice",
      resource: 11,
    },
    {
      id: 4,
      sortId: 4,
      name: "anything-you-want",
      resource: 90,
    },
  ];
  return (
    <section className="index-section">
      <div className="wrap">
        <div className="service-info-container">
          <div className="copyright-box">
            <h2>QWiK is the BEST, for YOU</h2>
          </div>
          <div className="step-container">
            <div className="step-box">
              <span className="step-num">step 1</span>
              <div className="step-info-text-box first">
                <i className="fab fa-github"></i>GitHub Login
              </div>
            </div>
            <div className="step-box">
              <span className="step-num">step 2</span>
              <div className="step-info-text-box">
                Enter Your Repository URL
              </div>
            </div>
            <div className="step-box">
              <span className="step-num">step 3</span>
              <div className="step-info-text-box">
                Enter Your Desired Domain
              </div>
            </div>
            <div className="step-box last">
              <span className="step-num">step 4</span>
              <div className="step-info-text-box">The End! Check Your Page</div>
            </div>
          </div>
        </div>
        <div className="service-overview-container">
          <div className="deployments-list-container">
            <h3>Deployments</h3>
            <div className="deployments-list-box">
              {indexDeploymentsList
                .sort((a, b) => a.sortId - b.sortId)
                .map((deployment) => (
                  <div key={deployment.id} className="deployment-box">
                    <span className="project-name">{deployment.name}</span>
                    <span className="domain-text">.qwik.com</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="dashboard-container">
            <h3>Dashboard</h3>
            <div className="monitor-container">
              <div className="usage-box">
                <div className="disk-usage-box">
                  <h4>Disk Usage</h4>
                  <div className="graph-box">
                    <div className="pie-chart"></div>
                  </div>
                </div>
                <div className="traffic-usage-box">
                  <h4>Traffic Usage</h4>
                  <div className="graph-box">
                    <div className="pie-chart"></div>
                  </div>
                </div>
              </div>
              <div className="resource-monitor-box">
                <h4>Resource Monitor</h4>
                {indexDeploymentsList
                  .sort((a, b) => a.sortId - b.sortId)
                  .map((deployment) => (
                    <div key={deployment.id} className="project-box">
                      <div className="text-box">
                        <p className="project-name">{deployment.name}</p>
                        <span className="percent-num">
                          {deployment.resource}
                        </span>
                      </div>
                      <div className="progress-bar-box">
                        <div
                          className="fill-bar"
                          style={{ width: `${deployment.resource}%` }}
                        ></div>
                        <div className="total-bar"></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
