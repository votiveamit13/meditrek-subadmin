import { Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Base_Url } from '../../config';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('terms');
  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');

      const termsRes = await axios.get(`${Base_Url}get_app_content?type=2`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const privacyRes = await axios.get(`${Base_Url}get_app_content?type=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (termsRes.data.success) {
        setTerms(termsRes.data.data);
      }

      if (privacyRes.data.success) {
        setPrivacy(privacyRes.data.data);
      }

   } catch (error) {
    console.error(error);
  } finally {
    setLoading(false); 
  }
};
  useEffect(() => {
    fetchContent();
  }, []);

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem('token');
    const doctorId = sessionStorage.getItem('doctor_id');

    try {
      const { value: reason } = await Swal.fire({
        title: 'Delete Account?',
        input: 'textarea',
        inputPlaceholder: 'Enter reason...',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete',
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('Reason required');
          }
          return value;
        }
      });

      if (reason) {
        const res = await axios.post(
          `${Base_Url}delete_account`,
          {
            doctor_id: doctorId,
            delete_reason: reason
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data.success) {
          Swal.fire('Deleted!', 'Account deleted', 'success').then(() => {
            sessionStorage.clear();
            navigate('/login');
          });
        } else {
          Swal.fire('Error', res.data.msg, 'error');
        }
      }
    } catch (err) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['terms', 'privacy', 'delete'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            style={{
              borderRadius: "999px",
              padding: "8px 24px",
              fontSize: "13px",
              background: activeTab === tab ? "#1ddec4" : "#eef2f7",
              color: activeTab === tab ? "#fff" : "#64748b",
              border: 0,
            }}
          >
            {tab === 'terms' && 'Terms & Conditions'}
            {tab === 'privacy' && 'Privacy Policy'}
            {tab === 'delete' && 'Delete Account'}
          </button>
        ))}
      </div>

      {/* Content */}
      <Card className="border-0 shadow-lg rounded-4" style={{ position: "relative", minHeight: 100 }}>
         {loading && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        borderRadius: "16px",
        padding: "40px"
      }}
    >
      <FadeLoader color="#1ddec4" height={10} width={3} radius={2} />
    </div>
  )}

        <Card.Body className="p-4">

          {activeTab === 'terms' && (
            <div>
              {/* <h5>Terms & Conditions</h5> */}
              <div
                dangerouslySetInnerHTML={{ __html: terms }}
              />
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              {/* <h5>Privacy Policy</h5> */}
              <div
                dangerouslySetInnerHTML={{ __html: privacy }}
              />
            </div>
          )}

          {activeTab === 'delete' && (
            <div>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Delete My Account
              </Button>
              <p className="text-muted mt-3" style={{ fontSize: '12px' }}>
                ⚠️ Warning: This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          )}

        </Card.Body>
      </Card>
    </>
  );
};

export default Settings;