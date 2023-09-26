import "./index.css";
import produtoService from "../../service/produto-service";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import Produto from "../../models/produto";
import { Button, Modal, Form } from "react-bootstrap";

function ProdutoPage() {
  const [produtos, setProdutos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produto, setProduto] = useState(new Produto());
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    produtoService
      .obter()
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  const editar = (e) => {
    setModoEdicao(true);
    let produtoEncontrado = produtos.find((p) => p.id == e.target.id);

    setProduto(produtoEncontrado);

    setModalAberto(true);
  };

  const excluir = (e) => {
    let produtoEncontrado = produtos.find((p) => p.id == e.target.id);

    if (
      window.confirm(
        "Deseja realmente exluir o produto? " + produtoEncontrado.nome
      )
    ) {
      excluirProdutoBackEnd(produtoEncontrado.id);
    }
  };

  const adicionar = () => {
    setModoEdicao(false);
  };

  const atualizarProduto = (produtoAtualizado, removerProduto = false) => {
    let indice = produtos.findIndex(
      (produto) => produto.id === produtoAtualizado.id
    );

    removerProduto
      ? produtos.splice(indice, 1)
      : produtos.splice(indice, 1, produto);

    setProdutos((arr) => [...arr]);
  };

  const salvar = () => {
    if (!produto.nome || !produto.quantidadeEstoque || !produto.valor) {
      Swal.fire({
        icon: "error",
        text: "todos os campos devem ser preenchidos! ",
      });
      return;
    }
    modoEdicao
      ? atualizarProdutoBackend(produto)
      : adicionarProdutoBackend(produto);

    setModalAberto(false);
  };

  const adicionarProdutoBackend = (produto) => {
    produtoService
      .adicionar(produto)
      .then((response) => {
        setProdutos((lista) => [...lista, new Produto(response.data)]);
        limparProduto();
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Produto cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });
      })
      .catch((erro) => {});
  };

  const atualizarProdutoBackend = (produto) => {
    produtoService
      .atualizar(produto)
      .then((response) => {
        atualizarProduto(response.data, false);
        limparProduto();
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Produto atualizado com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });
        setModalAberto(false);
      })
      .catch((erro) => {});
  };

  const excluirProdutoBackEnd = (id) => {
    produtoService
      .excluir(id)
      .then(() => {
        let produtoEncontrado = produtos.find((p) => p.id == id);
        atualizarProduto(produtoEncontrado, true);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Produto excluído com sucesso!",
          showConfirmButton: false,
          timer: 2500,
        });
      })
      .catch();
  };

  const limparProduto = () => {
    setProduto({
      ...produto,
      id: "",
      nome: "",
      valor: "",
      quantidadeEstoque: "",
      observacao: "",
    });
  };

  return (
    <div className="container">
      <h1>E-ROUPAS</h1>

      {/* <!-- Botão adicionar --> */}
      <div className="row">
        <div className="col-sm-3">
          <button
            id="btn-adicionar"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-produto"
            onClick={() => {
              adicionar();
            }}
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="grid">
        {/* <div className="item">
          <h2>Camisa Polo</h2>
          <p className="preco">R$ 40,00</p>
          <p>Camisa polo feita de algodão com detalhes em azul claro.</p>
          <p>Qtd 80</p>
          <button className="comprar">Comprar</button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#modal-produto"
          >
            Editar
          </button>
          <button type="button" className="btn btn-dark">
            Excluir
          </button>
        </div>
        <div className="item">
          <h2>Bermuda Preta</h2>
          <p className="preco">R$ 59,00</p>
          <p>Bermuda preta feita de algodão com detalhes em azul claro.</p>
          <p>Qtd 100</p>
          <button className="comprar">Comprar</button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#modal-produto"
          >
            Editar
          </button>
          <button type="button" className="btn btn-dark">
            Excluir
          </button>
        </div> */}

        {produtos.map((produto) => (
          <div>
            <h2>{produto.nome}</h2>
            {/* <p>{produto.id}</p> */}
            <p>{produto.valor}</p>
            <p>{produto.observacao}</p>
            <p>{produto.quantidadeEstoque}</p>
            <button className="comprar">Comprar</button>
            <button
              id={produto.id}
              onClick={editar}
              type="button"
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#modal-produto"
            >
              Editar
            </button>
            <button
              id={produto.id}
              type="button"
              onClick={excluir}
              className="btn btn-dark"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      {/* <!-- Modal --> */}
      <div className="row">
        {/* <!-- The Modal --> */}
        <div
          className={`modal fade modal-lg ${modalAberto ? "show" : ""}`}
          id="modal-produto"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              {/* <!-- Modal Header --> */}
              <div className="modal-header">
                <h4 className="modal-title">
                  {modoEdicao ? "Editar Produto" : "Adicionar Produto"}
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              {/* <!-- Modal body --> */}
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-2">
                    <label htmlFor="id" className="form-label">
                      ID
                    </label>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      id="id"
                      value={produto.id}
                      onChange={(e) =>
                        setProduto({ ...produto, id: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="produto" className="form-label">
                      PRODUTO
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="produto"
                      value={produto.nome}
                      onChange={(e) =>
                        setProduto({ ...produto, nome: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="valor" className="form-label">
                      VALOR
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="valor"
                      value={produto.valor}
                      onChange={(e) =>
                        setProduto({ ...produto, valor: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="quantidade" className="form-label">
                      QUANTIDADE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="quantidade"
                      value={produto.quantidadeEstoque}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          quantidadeEstoque: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="descricao" className="col-form-label">
                      DETALHES DO PRODUTO
                    </label>
                    <textarea
                      className="form-control"
                      id="descricao"
                      value={produto.observacao}
                      onChange={(e) =>
                        setProduto({ ...produto, observacao: e.target.value })
                      }
                    ></textarea>
                  </div>

                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button
                      id="btn-salvar"
                      className="btn btn-primary btn-sm"
                      onClick={salvar}
                    >
                      Salvar
                    </button>
                    <button
                      id="btn-cancelar"
                      className="btn btn-light btn-sm"
                      data-bs-dismiss="modal"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProdutoPage;
