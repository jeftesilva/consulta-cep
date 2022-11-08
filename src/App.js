import './App.css';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';

function App() {

  const [cepDigitado, setCepDigitado] = useState('');
  const [msgCep, setMsgCep] = useState('');
  const [logradouro, setlogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [ibge, setIbge] = useState('');
  const [ddd, setDdd] = useState('');
  const [loading, setLoading] = useState(false);

  const limparDados = () => {
    setMsgCep('');
    setlogradouro('');
    setBairro('');
    setCidade('');
    setEstado('');
    setIbge('');
    setDdd('');
  }

  const buscarCep = async () => {
    limparDados();
    if (cepDigitado === '') return;

    setLoading(true);
    try {
      const cep = cepDigitado.replace('-', '');
      const dadosCep = await (await fetch(`https://viacep.com.br/ws/${cep}/json/`)).json();

      if (dadosCep.erro) {
        setMsgCep('CEP não encontrado');
        return;
      };

      setlogradouro(dadosCep.logradouro);
      setBairro(dadosCep.bairro);
      setCidade(dadosCep.localidade);
      setEstado(dadosCep.uf);
      setIbge(dadosCep.ibge);
      setDdd(dadosCep.ddd);
    } catch (error) {
      console.log(error);
      setMsgCep('Falha ao consultar CEP');
    } finally {
      setLoading(false);
    }
  }

  const inputOnChange = (e) => {
    if (msgCep || logradouro) limparDados();

    setCepDigitado(e.target.value);
  }

  const inputOnKeyPress = (e) => {
    var charCode = e.charCode ? e.charCode : e.keyCode;
    if (charCode !== 8 && charCode !== 9) {
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
      }
    }
  }
  
  const inputOnKeyUp = (e) => {
    if (e.key === 'Enter') {
      buscarCep();
    }
  }

  const buttonOnClick = (e) => {
    e.preventDefault();
    buscarCep();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Consulta CEP</h1>
        <form>
          <input type="text" autoFocus maxLength={8} placeholder="Digite um CEP" 
            onChange={inputOnChange} onKeyUp={inputOnKeyUp} onKeyPress={inputOnKeyPress} value={cepDigitado} />
          <button disabled={!cepDigitado} onClick={buttonOnClick}>
            { loading ? <BiLoaderCircle className='icone-loading'/> : <AiOutlineSearch className='icone-busca' /> }
          </button>
        </form>
        <span className='msg-cep' style={{display: msgCep ? 'block' : 'none'}}>CEP não encontrado</span>
        <div style={{display: cepDigitado && logradouro ? 'block' : 'none'}}>
          <span className='rotulo-dados'>Logradouro: </span><span className='texto-dados'>{logradouro}</span><br/>
          <span className='rotulo-dados'>Bairro: </span><span className='texto-dados'>{bairro}</span><br/>
          <span className='rotulo-dados'>Cidade: </span><span className='texto-dados'>{cidade}</span><br/>
          <span className='rotulo-dados'>Estado: </span><span className='texto-dados'>{estado}</span><br/>
          <span className='rotulo-dados'>IBGE: </span><span className='texto-dados'>{ibge}</span><br/>
          <span className='rotulo-dados'>DDD: </span><span className='texto-dados'>{ddd}</span>
        </div>
      </header>
    </div>
  );
}

export default App;
