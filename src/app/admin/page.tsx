import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function AdminAuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        // 🔥 هنا الحل
        if (data.isAdmin === true || data.role === "admin") {
          setIsAdmin(true);
        }
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAdmin) return <div>🚫 غير مصرح</div>;

  return children;
}
