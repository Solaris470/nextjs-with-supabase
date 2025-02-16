"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useUserRole } from "@/context/userRoleContext";

export default function Contact() {
  const supabase = createClient();
  const [userData, setUserData] = useState<any>([]);
  const {role } = useUserRole();

  const fetchUserData = async () => {
    let { data: data, error } = await supabase
      .from("users")
      .select("id, profile_image ,full_name, email, role")
      .neq("role", "admin")
      .eq("status" ,"active");

    setUserData(data);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
      <div className="bg-[#f5f6fa]">
        <h1 className="pt-12 pl-12 pb-2 text-start text-4xl font-medium">
          Contact
        </h1>
        <div className="grid grid-cols-4 gap-4 text-center">
          {userData.map((dataContacts: any) => (
            <div className="justify-center">
              <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img
                    className="rounded-t-lg object-cover h-72 w-full"
                    src={dataContacts.profile_image || "/images/default_profile.jpg"}
                    alt=""
                  />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {dataContacts.full_name}
                    </h5>
                  </a>
                  <p className="mb>-3 font-normal text-gray-700 dark:text-gray-400">
                    {dataContacts.email}
                  </p>
                  <p className="mb>-3 font-normal text-gray-700 dark:text-gray-400">
                    ตำแหน่ง : {dataContacts.role}
                  </p>
                </div>
                <div>
                  {role === "supervisor" && (
                    <Link href={`/contact/add?id=${dataContacts.id}`}>
                      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        มอบงาน
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
