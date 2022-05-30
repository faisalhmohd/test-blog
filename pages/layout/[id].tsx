import Layout from '../../server/models/layout';
import connectToDatabase from '../../server/utils/db';

const LayoutPage = ({ layout }) => {
  const layoutData = {
    mainCTA: {
      title: layout.mainCTA?.title || 'Advancement is Omega',
      description: layout.mainCTA?.description || 'Solving the problems of today to see a tomorrow worth living and a past worth remembering.',
      ctaText: layout.mainCTA?.ctaText || 'Learn More',
      image: layout.mainCTA?.image || '/images/hero-slider-01.jpg'
    },
    mission: {
      title: layout.mission?.title || 'Propel Advancement',
      description: layout.mission?.description || 'Introducing the world’s first Advancement Company. As we enter the dawn of the digital age a significant \
      leap must be made to propel the world into the age of advancement.',
      videoThumbnail: layout.mission?.videoThumbnail || '/images/video-thumb.jpg',
      video: layout.mission?.video || 'https://www.youtube.com/embed/ResipmZmpDU?autoplay=1&showinfo=0&controls=0',
      backgroundImage: layout.mission?.backgroundImage || '/images/section-bg.jpg'
    },
    vision: {
      ctas: layout.vision?.ctas.map(cta => ({
        title: cta.title || 'People First',
        description: cta.description || 'I started with a vision of creating an atmosphere where people come first.',
        backgroundImage: '/images/vision-01.jpg',
      }))
    },
    products: {
      title: layout.products?.title || 'Some Of Our Best Products',
      description: layout.products?.description || 'See the innovation that has come through the Rio way. As an advancement company, the goal is to \
      continuously find areas to help business push forward. Below you can find the first product available to \
      help you do so.',
      slider: layout.products?.slider.map(slide => ({
          title: slide.title || 'Objects',
          description: slide.description || 'Omega OS Version 2.0 is the world’s first and only cloud operating system. See how this \
          revolutionarys oftware can become the center of your business.',
          backgroundImage: '/images/product-02.jpg',
      }))
    },
    contactUs: {
      title: layout.contactUs?.title || 'reach us',
      description: layout.contactUs?.description || 'The dawn of the digital age and the need for a significant leap forward is here. We believe that every \
      business has the opportunity to move into this new age with the right mindset. Contact us today to begin \
      understanding how Omega can propel your business.',
      location: {
        latitude: layout.contactUs?.location.latitude,
        longitude: layout.contactUs?.location.longitude,
      },
      image: 'https://demo.gethugothemes.com/omega/site/images/map-bg.jpg',
      addressText: layout.contactUs?.addressText || '1001 Brickell bay, Dr. Miami, FL 33131',
      socialLinks: {
        facebook: layout.contactUs?.socialLinks?.facebook || '#',
        twitter: layout.contactUs?.socialLinks?.twitter || '#',
        instagram: layout.contactUs?.socialLinks?.instagram || '#',
        github: layout.contactUs?.socialLinks?.github || '#',
        linkedin: layout.contactUs?.socialLinks?.linkedin || '#'
      },
    },
    joinUs: {
      title: layout.joinUs?.title || 'Join the Omega family.',
      ctaText: layout.joinUs?.ctaText || 'Click below to view the career opportunities we have for you.',
    },
  };

  return (
    <div>
      <div className="dividers">
        <div className="divider" />
        <div className="divider" />
        <div className="divider" />
        <div className="divider" />
        <div className="divider" />
      </div>
      <div className="preloader" style={{ display: 'none' }}>
        <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
      </div>
      <header className="nav-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand" href="/omega/site/">
                  <img className="img-fluid" width="120px" src="/images/logo.png" alt="OMEGA" />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon">
                    <img src="/images/hamburger-icon.png" className="img-fluid" alt="menu" />
                  </span>
                </button>
                <div className="collapse navbar-collapse" id="main-nav">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <a className="nav-link page-scroll" href="https://demo.gethugothemes.com/omega/site/#mission">About</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link page-scroll" href="https://demo.gethugothemes.com/omega/site/#products">Products</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link page-scroll" href="https://demo.gethugothemes.com/omega/site/career">Career</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link page-scroll" href="https://demo.gethugothemes.com/omega/site/#contact">Contact</a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <section className="hero-slider">
        <div className="container-fluid p-0 m-0">
          <div className="row m-0">
            <div className="col-12 p-0 ml-auto">
              <div className="hero-slider-wrapper">
                <div className="item">
                  <div className="item-image image-reveal trigger" style={{ animationDelay: '2s' }}>
                    <img src={layoutData.mainCTA.image} alt="slider-image" />
                  </div>
                  <div className="content">
                    <h2>
                      <span className="rev reveal-text">
                        {layoutData.mainCTA.title}
                      </span>
                    </h2>
                    <h3>{layoutData.mainCTA.description}</h3>
                    <a href="#" className="hero-btn btn page-scroll">{layoutData.mainCTA.ctaText}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 text-center">
              <div className="scroll">
                <h6>SCROLL</h6>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mission" id="mission">
        <div className="bg">
          <img src={layoutData.mission.backgroundImage} className="img-fluid" alt="section-bg" />
        </div>
        <div className="right-shape">
          <img src="/images/right-shape.png" className="img-fluid" alt="right-shape" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <span>MISSION</span>
              </div>
              <div className="mission-content">
                <h2><span className="rev reveal-text">{layoutData.mission.title}</span></h2>
                <p>{layoutData.mission.description}</p>
                <div className="video image-reveal trigger">
                  <a className="video-play" data-video={layoutData.mission.video}>
                    <img src={layoutData.mission.videoThumbnail} className="img-fluid" alt="video-thumb" />
                    <i className="fa fa-play" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="vision">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <span>VISION</span>
              </div>
              <div className="visions">
                {layoutData.vision.ctas.map((cta, index) => (
                  <div className="vision-item" key={index}>
                    <div className="image image-reveal trigger">
                      <img src={cta.backgroundImage} className="img-fluid" alt="vision-thumb" />
                    </div>
                    <div className="text-content">
                      <h3>{cta.title}</h3>
                      <p>{cta.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="products" id="products">
        <div className="bg">
          <img src="/images/section-bg-2.jpg" className="img-fluid" alt="section-bg" />
        </div>
        <div className="left-shape">
          <img src="/images/left-shape.png" className="img-fluid" alt="left-shape" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <span>Products</span>
              </div>
            </div>
            <div className="col-md-8">
              <div className="text-block">
                <h2><span className="rev reveal-text">{layoutData.products.title}</span>
                </h2>
                <p>{layoutData.products.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid p-0">
          <div className="row m-0">
            <div className="col-lg-10 ml-auto p-0">
              <div className="product-slider-wrapper slick-initialized slick-slider"><button type="button" className="slick-prev slick-arrow" style={{}}><i className="fa fa-angle-left" aria-hidden="true" /></button>
                <div className="slick-list draggable">
                  <div className="slick-track" >
                    {layoutData.products.slider.map((slide, index) => (
                      <div className="product-item slick-slide slick-cloned" style={{ width: '370px' }} data-slick-index={index - 2} aria-hidden="true" tabIndex={-1} key={index}>
                        <img src="/images/product-02.jpg" alt="product-image" />
                        <div className="overlay">
                          <div className="content">
                            <h5>{slide.title}</h5>
                            <p>{slide.description}</p>
                            <a href="#" tabIndex={-1}>Learn More</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div><button type="button" className="slick-next slick-arrow" style={{}}><i className="fa fa-angle-right" aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="contact" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <span>CONTACT US</span>
              </div>
            </div>
            <div className="col-lg-7 ml-auto">
              <div className="text-block">
                <h2><span className="rev reveal-text">{layoutData.contactUs.title}</span></h2>
                <p>{layoutData.contactUs.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="map-div">
          <iframe
            id="map"
            style={{ "border": 0, "width": "100%", "filter": "invert(90%)" }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-bt4yiXKUqTS7XJL2SnE3wJHLwy4ZNos&q=${layoutData.contactUs.location.latitude},${layoutData.contactUs.location.longitude}&zoom=3`}
          />
          <div className="office">
            <div className="contents">
              <img src={layoutData.contactUs.image} alt="office" />
              <div className="address">
                <h2>{layoutData.contactUs.addressText}</h2>
                <ul className="social-list list-inline">
                  <li className="list-inline-item">
                    <a href={layoutData.contactUs.socialLinks.facebook} target="_blank" rel="noreferrer">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href={layoutData.contactUs.socialLinks.twitter} target="_blank" rel="noreferrer">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href={layoutData.contactUs.socialLinks.instagram} target="_blank" rel="noreferrer">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href={layoutData.contactUs.socialLinks.github} target="_blank" rel="noreferrer">
                      <i className="fa fa-github" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href={layoutData.contactUs.socialLinks.linkedin} target="_blank" rel="noreferrer">
                      <i className="fa fa-linkedin" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer show">
        <div className="call-to-action text-center">
          <h2>{layoutData.joinUs.title}</h2>
          <a href="#">{layoutData.joinUs.ctaText}</a>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{ __html: "\n    .cookie-box {\n      position: fixed;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      text-align: center;\n      z-index: 9999;\n      padding: 1rem 2rem;\n      background: #474747;\n      transition: all .75s cubic-bezier(.19, 1, .22, 1);\n      color: #fdfdfd\n    }\n\n    .cookie-box-hide {\n      display: none\n    }\n  " }} />
      <div style={{ position: 'absolute', left: '0px', top: '-2px', height: '1px', overflow: 'hidden', visibility: 'hidden', width: '1px' }}>
        <span style={{ position: 'absolute', fontSize: '300px', width: 'auto', height: 'auto', margin: '0px', padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>BESbswy</span>
      </div>
    </div>
  );
}

export default LayoutPage;

export async function getServerSideProps({ query, res }) {
  try {
    await connectToDatabase();
    const layout = await Layout.findById(query.id).lean();
    return { props: { layout: JSON.parse(JSON.stringify(layout)) } }
  } catch (err) {
    return { notFound: true };
  }
}