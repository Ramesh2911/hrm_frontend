function MobileLogo(props) {
  const { handleShowTopbar, handleShowSidebar, changeIcon, handleChangeIcon } =
    props;

  return (
    <div className="pc-mob-header pc-header">
      <div className="pcm-logo">
        <img src="/assets/images/logo.webp" alt="" className="logo logo-lg" />
      </div>
      <div className="pcm-toolbar">
        <a
          href="#!"
          className="pc-head-link"
          id="mobile-collapse"
          onClick={() => {
            props.handleShowSidebar();
            props.handleChangeIcon();
          }}
        >
          <div
            className={
              changeIcon
                ? "hamburger hamburger--arrowturn is-active"
                : "hamburger hamburger--arrowturn"
            }
          >
            <div className="hamburger-box">
              <div className="hamburger-inner"></div>
            </div>
          </div>
          {/* <!-- <i data-feather="menu"></i> --> */}
        </a>
        <a
          href="#!"
          className="pc-head-link"
          id="header-collapse"
          onClick={handleShowTopbar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-more-vertical"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default MobileLogo;
