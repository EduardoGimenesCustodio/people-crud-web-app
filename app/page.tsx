"use client";

import React, { useEffect, useState } from "react";
import { Button, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

interface DataType {
  key: string;
  id_pessoa: string;
  nome: string;
  data_admissao: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Nome",
    dataIndex: "nome",
    key: "nome",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Data de admissão",
    dataIndex: "data_admissao",
    key: "data_admissao",
    render: (date) => <a>{date}</a>,
  },
  {
    title: "Ações",
    key: "acoes",
    render: (_, record) => (
      <Space size="middle">
        <a href={`/person/read/${record.id_pessoa}`}>Ver mais</a>
        <a href={`/person/update/${record.id_pessoa}`}>Editar</a>
        <a>Excluir</a>
      </Space>
    ),
  },
];

const Home: React.FC = () => {
  const [tableData, setTableData] = useState();

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_HOST}/person`,
    })
      .then((res) => {
        setTableData(
          res.data.pessoas.map((pessoa: any) => {
            return {
              key: pessoa.id_pessoa,
              id_pessoa: pessoa.id_pessoa,
              nome: pessoa.nome,
              data_admissao: pessoa.data_admissao,
            };
          })
        );
      })
      .catch(() => {
        error();
      });
  });

  const error = () => {
    message.error("Erro ao listar pessoas");
  };

  return (
    <div>
      <Button type="primary" href="/person/create">
        Cadastrar pessoa
      </Button>
      <Table columns={columns} dataSource={tableData} />
    </div>
  );
};

export default Home;
