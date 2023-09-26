import "./index.css";

import { Link, useLocation } from "react-router-dom";
import usuarioService from "../../service/usuario-service";

function Menu() {
  const logout = () => {
    usuarioService.sairSistema();
  };

  if (useLocation().pathname !== "/login") {
    return (
      <div className="navegacao">
        <Link to="/">
          <button>HOME</button>
        </Link>
        <Link to="/produtos">
          <button>PRODUTOS</button>
        </Link>
        <Link onClick={logout}>
          <button>SAIR</button>
        </Link>
      </div>
    );
  } else {
    return null; //retorna nada para o componente não ser renderizado no DOM
  }
}

export default Menu;
