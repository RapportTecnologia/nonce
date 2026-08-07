# Nonce — Laboratório Didático de Blockchain

Página interativa criada para demonstrar, de forma visual e prática, como o **nonce participa do cálculo do hash de um bloco** e como o **hash de um bloco é utilizado pelo bloco seguinte**, formando o encadeamento característico de uma Blockchain.

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
