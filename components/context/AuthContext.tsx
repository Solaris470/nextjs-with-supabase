// import { createContext, useState, useContext } from 'react';

// // สร้าง Context
// const AuthContext = createContext();

// // ผู้ให้บริการ Context
// export function AuthProvider({ children }) {
//   const [role, setRole] = useState(null); // State สำหรับเก็บ Role ของผู้ใช้

//   return (
//     <AuthContext.Provider value={{ role, setRole }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Hook สำหรับใช้ Context
// export function useAuth() {
//   return useContext(AuthContext);
// }
