import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function LayoutProtegido() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutProtegido;
