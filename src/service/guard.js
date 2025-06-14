// src/service/guard.js
import React from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

export const ProtectedRoute = ({element: Component})=>{  // ✅ CORREGIDO: Element → element
  const location = useLocation();

  return ApiService.isAuthenticated() ?(
    Component
  ):(
    <Navigate to="/login" replace state={{from: location}}/>
  );
};

export const AdminRoute = ({element: Component})=>{
  const location = useLocation();

  return ApiService.isAdmin() ?(
    Component
  ):(
    <Navigate to="/login" replace state={{from: location}}/>  // ✅ También agregué "/" antes de login
  );
};
