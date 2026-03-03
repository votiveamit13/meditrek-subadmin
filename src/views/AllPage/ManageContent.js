import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './managecontent.css';
import Typography from '@mui/material/Typography';
import JoditEditor from 'jodit-react';
import axios from 'axios';

function Managecontent() {
  const options = [
    'bold',
    'italic',
    '|',
    'ul',
    'ol',
    '|',
    'font',
    'fontsize',
    '|',
    'outdent',
    'indent',
    'align',
    '|',
    'hr',
    '|',
    'fullsize',
    'brush',
    '|',
    'table',
    'link',
    '|',
    'undo',
    'redo'
  ];

  const [content, setContent] = useState(0);
  const [about, setAbout] = useState('');
  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [android, setAndroid] = useState('');
  const [ios, setIos] = useState('');
  const [activeButton, setActiveButton] = useState('about');
  
  const contentTypes = {
    about: 0,
    terms: 1,
    privacy: 2,
    android: 3,
    ios: 4
  };

  useEffect(() => {
    fetchContent('about', setAbout);
    fetchContent('terms', setTerms);
    fetchContent('privacy', setPrivacy);
    fetchContent('android', setAndroid);
    fetchContent('ios', setIos);
  }, []);

  const fetchContent = (contentType, setter) => {
    axios
      .get(`http://localhost:3001/fetchaboutcontent?contentType=${contentTypes[contentType]}`)
      .then((response) => {
        setter(response.data[0].content);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const config1 = useMemo(
    () => ({
      readonly: false,
      placeholder: '',
      defaultActionOnPaste: 'insert_as_html',
      defaultLineHeight: 1.2,
      enter: 'div',
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false
    }),
    []
  );

  const handleButtonClick = (contentType) => {
    setContent(contentTypes[contentType]);
    setActiveButton(contentType);
    console.log(contentType);
  };

  const handleBanner = (contentType) => {
    let contentStateToUpdate;
    switch (contentType) {
      case 'about':
        contentStateToUpdate = about;
        break;
      case 'terms':
        contentStateToUpdate = terms;
        break;
      case 'privacy':
        contentStateToUpdate = privacy;
        break;
      case 'android':
        contentStateToUpdate = android;
        break;
      case 'ios':
        contentStateToUpdate = ios;
        break;
      default:
        contentStateToUpdate = '';
    }
    axios
      .patch(`http://localhost:3001/updateContent`, {
        contentType: contentTypes[contentType],
        content: contentStateToUpdate
      })
      .then(() => {
        console.log(`${contentType} updated successfully`);
      })
      .catch((error) => {
        console.log(error);
        console.log('error aa agay');
      });
  };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Content
      </Typography>
      {/* <Typography variant="h4" gutterBottom>
        Manage Content
      </Typography> */}

      <div className="container-fluid bg-white" style={{ borderRadius: '8px', paddingBottom: '20px' }}>
        <div className="row justify-content-center" style={{ marginTop: '2rem' }}>
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg navbar-light  navBar mt-3 ">
              <div className="container-fluid navbar-responsive">
                <button
                  className={`btn me-2 mb-2 btn-content ${activeButton === 'about' ? 'active' : ''}`}
                  style={{ width: '11rem', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('about')}
                >
                  ABOUT US
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'terms' ? 'active' : ''}`}
                  style={{ width: '13rem', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('terms')}
                  id="termss"
                >
                  TERMS AND CONDITIONS
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'privacy' ? 'active' : ''}`}
                  style={{ width: '11rem', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('privacy')}
                >
                  PRIVACY POLICY
                </button>
                <button
                  className={`btn  me-2 mb-2  btn-content ${activeButton === 'android' ? 'active' : ''}`}
                  style={{ width: '11rem', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('android')}
                >
                  ANDROID APP URL
                </button>
                <button
                  className={`btn  me-2 mb-2 btn-content ${activeButton === 'ios' ? 'active' : ''}`}
                  style={{ width: '10rem', fontSize: '14px' }}
                  type="button"
                  onClick={() => handleButtonClick('ios')}
                >
                  IOS APP URL
                </button>
              </div>
            </nav>
            <br />
            <div className="user-details">
              {content === 0 && (
                <div>
                  <span className="mb-2" style={{ fontSize: '15px' }}>
                    About us
                  </span>
                  <div>
                    <JoditEditor value={about} config={config1} onChange={(htmlString) => setAbout(htmlString)} />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('about')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 1 && (
                <div>
                  <span>Terms And Conditions</span>
                  <div>
                    <JoditEditor value={terms} config={config1} onChange={(htmlString) => setTerms(htmlString)} />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('terms')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 2 && (
                <div>
                  <span>Privacy Policy</span>
                  <div>
                    <JoditEditor value={privacy} config={config1} onChange={(htmlString) => setPrivacy(htmlString)} />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('privacy')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 3 && (
                <div>
                  <span>Android App Url</span>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={android}
                      onChange={(e) => setAndroid(e.target.value)}
                      placeholder="Enter android app url"
                    />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('android')}>
                    Update
                  </button>{' '}
                </div>
              )}
              {content === 4 && (
                <div>
                  <span>IOS App Url</span>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={ios}
                      onChange={(e) => setIos(e.target.value)}
                      placeholder="Enter ios app url"
                    />
                  </div>
                  <br />
                  <button className="btn mt-2 submit-btn" onClick={() => handleBanner('ios')}>
                    Update
                  </button>{' '}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Managecontent;
