// Copyright (c) 2026 Daniel Felix Ferber

import { enderecoDeContato } from "../lib/contato";
import "./LinkDeContato.css";

// Link do canal de contato, comum às vistas de política de privacidade e de
// termos de uso (TDR 0028). `href` e texto visível saem da mesma função, para
// o endereço ter um dono único; `rel="nofollow noreferrer"` marca o link como
// não seguível.
export function LinkDeContato() {
  const endereco = enderecoDeContato();

  return (
    <a
      className="link-de-contato"
      href={`mailto:${endereco}`}
      rel="nofollow noreferrer"
    >
      {endereco}
    </a>
  );
}
