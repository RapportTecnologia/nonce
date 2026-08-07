<div align="center">

# Nonce — Laboratório Didático de Blockchain

Página interativa criada para demonstrar, de forma visual e prática, como o **nonce participa do cálculo do hash de um bloco** e como o **hash de um bloco é utilizado pelo bloco seguinte**, formando o encadeamento característico de uma Blockchain.

[![Visitantes](https://api.visitorbadge.io/api/visitors?path=RapportTecnologia%2Fnonce&label=Visitantes&countColor=%23f97316&style=flat-square)](https://github.com/RapportTecnologia/nonce)
[![GitHub Stars](https://img.shields.io/github/stars/RapportTecnologia/nonce?style=flat-square&logo=github&label=Stars)](https://github.com/RapportTecnologia/nonce/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/RapportTecnologia/nonce?style=flat-square&logo=github&label=Forks)](https://github.com/RapportTecnologia/nonce/network/members)
[![Issues](https://img.shields.io/github/issues/RapportTecnologia/nonce?style=flat-square&logo=github&label=Issues)](https://github.com/RapportTecnologia/nonce/issues)
[![Último commit](https://img.shields.io/github/last-commit/RapportTecnologia/nonce?style=flat-square&logo=git&label=%C3%9Altimo%20commit)](https://github.com/RapportTecnologia/nonce/commits/main)
[![Tamanho do repositório](https://img.shields.io/github/repo-size/RapportTecnologia/nonce?style=flat-square&label=Tamanho)](https://github.com/RapportTecnologia/nonce)
[![Branch](https://img.shields.io/badge/branch-main-f97316?style=flat-square&logo=git)](https://github.com/RapportTecnologia/nonce/tree/main)
[![Visibilidade](https://img.shields.io/badge/reposit%C3%B3rio-p%C3%BAblico-2ea44f?style=flat-square&logo=github)](https://github.com/RapportTecnologia/nonce)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-laborat%C3%B3rio%20online-f97316?style=flat-square&logo=githubpages&logoColor=white)](https://rapporttecnologia.github.io/nonce/)
[![HTML5](https://img.shields.io/badge/HTML5-interface-E34F26?style=flat-square&logo=html5&logoColor=white)](./index.html)
[![CSS3](https://img.shields.io/badge/CSS3-layout-1572B6?style=flat-square&logo=css3&logoColor=white)](./styles.css)
[![JavaScript](https://img.shields.io/badge/JavaScript-SHA--256%20%26%20Nonce-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](./script.js)

**Rapport Tecnologia — Departamento de Treinamentos**  
*Inove • Aprenda • Transforme*

</div>

---

## Estado do projeto

| Item | Estado |
|---|---|
| **Tipo** | Laboratório didático interativo |
| **Publicação** | GitHub Pages |
| **Branch principal** | `main` |
| **Tecnologias** | HTML5, CSS3 e JavaScript puro |
| **Hash demonstrado** | SHA-256 |
| **Execução** | 100% no navegador |
| **Dependências externas** | Nenhuma |
| **Finalidade** | Ensino de Blockchain, Nonce, Proof of Work e encadeamento de blocos |

> **Acessar o laboratório:** https://rapporttecnologia.github.io/nonce/

---

## Objetivos didáticos

O laboratório permite observar que:

- um bloco reúne **metadados** e **dados/transações**;
- os dados são serializados de forma determinística antes do cálculo do hash;
- o laboratório calcula um **SHA-256 real** no navegador;
- mudar apenas o `nonce` produz um hash completamente diferente — o chamado **efeito avalanche**;
- uma dificuldade didática pode exigir que o hash comece com determinada quantidade de zeros;
- a mineração simulada testa sucessivos valores de `nonce` até encontrar um hash que atenda ao critério;
- o hash obtido para o **Bloco N** é entregue ao **Bloco N+1** como `previousHash`;
- se o bloco N for alterado depois de selado, seu hash muda e a referência armazenada pelo próximo bloco deixa de coincidir, evidenciando a quebra da cadeia.

## Como usar

1. Altere os metadados ou as transações do bloco.
2. Observe o hash SHA-256 sendo recalculado.
3. Clique em **Nonce +1** algumas vezes e compare os hashes.
4. Ajuste a dificuldade entre 1 e 5 zeros.
5. Clique em **Minerar nonce válido**.
6. Quando um hash válido for encontrado, clique em **Selar bloco e encadear**.
7. Altere novamente qualquer dado do bloco e observe o indicador de integridade da cadeia.

> Quanto maior a dificuldade, maior tende a ser a quantidade de tentativas necessárias. O botão **Parar** interrompe a busca.

## Estrutura

```text
.
├── index.html   # Estrutura e conteúdo didático
├── styles.css   # Identidade visual e responsividade
├── script.js    # SHA-256, nonce, mineração e encadeamento
└── README.md
```

## Observação técnica

Este projeto é uma **simulação educacional**. Ele representa os conceitos de bloco, nonce, Proof of Work e encadeamento de forma simplificada. Redes reais, como o Bitcoin, possuem formatos específicos de cabeçalho, serialização binária, cálculo de target/dificuldade, consenso, propagação de blocos, validação de transações e outras regras de protocolo.

A chamada `Merkle Root` mostrada no laboratório é um resumo SHA-256 didático do conjunto serializado de transações. Uma implementação real de Merkle Tree combina hashes de transações em uma estrutura hierárquica.

## Rapport Tecnologia

Material do **Departamento de Treinamentos da Rapport Tecnologia**.

**Inove • Aprenda • Transforme**
