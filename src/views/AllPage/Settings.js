import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Base_Url } from '../../config';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          padding: "16px"
        }}
      >

        {/* Header (same as NewInsights) */}
        <div className="mb-3">
          <h6 style={{ fontWeight: 600, marginBottom: 2 }}>
            Settings
          </h6>
          {/* <small style={{ color: "#64748b" }}>
            Manage your account preferences
          </small> */}
        </div>

        {/* List */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

          {/* Terms */}
          <button
            className="d-flex justify-content-between align-items-center px-4 py-3 w-100 border-0 bg-white text-start"
            onClick={() => navigate('/terms')}
          >
            <span className="fw-medium">Terms & Conditions</span>
            <span className="text-muted fs-5">›</span>
          </button>

          <hr className="m-0" />

          {/* Privacy */}
          <button
            className="d-flex justify-content-between align-items-center px-4 py-3 w-100 border-0 bg-white text-start"
            onClick={() => navigate('/privacy-policy')}
          >
            <span className="fw-medium">Privacy Policy</span>
            <span className="text-muted fs-5">›</span>
          </button>

          <hr className="m-0" />

          {/* Delete */}
          <button
            className="d-flex justify-content-between align-items-center px-4 py-3 w-100 border-0 bg-white text-start"
            onClick={handleDeleteAccount}
          >
            <span className="fw-medium text-danger">Delete Account</span>
            <span className="text-danger fs-5">›</span>
          </button>

        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(255,255,255,0.6)", zIndex: 999 }}
        >
          <FadeLoader color="#1ddec4" height={10} width={3} radius={2} />
        </div>
      )}

    </div>
  );
};

export default Settings;