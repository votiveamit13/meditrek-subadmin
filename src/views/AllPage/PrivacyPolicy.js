import { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../../config";
import { FadeLoader } from "react-spinners";

const contentStyle = {
  lineHeight: 1.6,
  fontSize: 14,
  color: "#374151"
};

const Loader = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    padding: 40
  }}>
    <FadeLoader color="#1ddec4" height={10} width={3} radius={2} />
  </div>
);

const PrivacyPage = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrivacy = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await axios.get(
        `${Base_Url}get_app_content?type=2`, // ✅ privacy
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Privacy API:", res.data);

      if (res.data.success) {
        setContent(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacy();
  }, []);

  return (
    <div className="p-2">
      <h2 style={{ marginBottom: 16 }}>Privacy Policy</h2>

      <div>
        {loading ? <Loader /> : (
          <div
            style={contentStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;