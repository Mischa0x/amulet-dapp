function HeaderLanding() {
  const headerStyle = {
    alignItems: "center",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem 1rem 6rem",
  };

  const logoStyle = {
    color: "var(--mapped-text-headings)",
    fontFamily: "var(--body-lg-font-family)",
    fontSize: "var(--body-lg-font-size)",
    fontStyle: "var(--body-lg-font-style)",
    fontWeight: "var(--body-lg-font-weight)",
    letterSpacing: "var(--body-lg-letter-spacing)",
    lineHeight: "var(--body-lg-line-height)",
    position: "relative",
    textAlign: "center",
    whiteSpace: "nowrap",
    width: "fit-content",
  };

  const badgeWrapperStyle = {
    alignItems: "center",
    border: "1px solid var(--brand-blue-default)",
    borderRadius: "8px",
    display: "inline-flex",
    flex: "0 0 auto",
    gap: "11px",
    padding: "6px 10px",
    position: "relative",
  };

  const badgeStyle = {
    alignItems: "center",
    display: "inline-flex",
    flex: "0 0 auto",
    gap: "10px",
    justifyContent: "center",
    position: "relative",
  };

  const badgeTextStyle = {
    color: "var(--mapped-text-body)",
    fontFamily: "var(--body-md-font-family)",
    fontSize: "var(--body-md-font-size)",
    fontStyle: "var(--body-md-font-style)",
    fontWeight: "var(--body-md-font-weight)",
    letterSpacing: "var(--body-md-letter-spacing)",
    lineHeight: "var(--body-md-line-height)",
    marginTop: "-1px",
    position: "relative",
    whiteSpace: "nowrap",
    width: "fit-content",
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>AMULET AI</div>
      <div style={badgeWrapperStyle}>
        <div style={badgeStyle}>
          <img
            alt="Infinity badge"
            src="/assets/blue_logo_transparent_square.png"
          />
          <div style={badgeTextStyle}>LONGEVITY AGENT</div>
        </div>
      </div>
    </header>
  );
}

export default HeaderLanding;
