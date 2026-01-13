import { useState } from "react";

function Sidebar({ isOpen, closeSidebar }) {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: "",
    shareLink: "",
  });

  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const link = `https://www.google.com/maps?q=${lat},${lng}`;

        // Reverse geocode to get address
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setLocation({
              lat,
              lng,
              address: data.display_name,
              shareLink: link,
            });
          })
          .catch(() => {
            setLocation({
              lat,
              lng,
              address: "Unable to fetch address",
              shareLink: link,
            });
          });
      },
      () => alert("Please enable GPS & grant location permission")
    );
  };

  const addContact = () => {
    if (!name || !phone) {
      alert("Please enter both name and phone number");
      return;
    }

    setContacts([...contacts, { name, phone }]);
    setName("");
    setPhone("");
  };

  if (!isOpen) return null;

  return (
    <div style={styles.sidebar}>
      <button onClick={closeSidebar} style={styles.closeBtn}>✕</button>

      <h3>📍 Live Location</h3>
      <button onClick={getLocation}>Get My Location</button>

      {location.address && (
        <>
          <p style={{ marginTop: "10px" }}>
            <strong>Address:</strong><br />
            {location.address}
          </p>

          {/* Shareable Map Link */}
          <p style={{ marginTop: "5px" }}>
            <strong>Share link:</strong><br />
            <a
              href={location.shareLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0077cc" }}
            >
              {location.shareLink}
            </a>
          </p>

          {/* Optional: small coords */}
          <small style={{ color: "#666" }}>
            ({location.lat}, {location.lng})
          </small>
        </>
      )}

      <hr style={{ margin: "15px 0" }} />

      <h3>⭐ Favourite Contacts</h3>
      <input
        placeholder="Contact name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={styles.input}
      />

      <button onClick={addContact} style={styles.addBtn}>Add</button>

      <ul>
        {contacts.map((c, i) => (
          <li key={i}>
            <strong>{c.name}</strong> – {c.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: "#f1ecf9",
    position: "fixed",
    top: 0,
    left: 0,
    padding: "60px 15px 15px 15px",
    borderRight: "1px solid #ddd",
    zIndex: 2000,
    overflowY: "auto",
  },
  closeBtn: {
    float: "right",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "6px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addBtn: {
    width: "100%",
    padding: "6px",
    marginTop: "8px",
    background: "#c354ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

export default Sidebar;
