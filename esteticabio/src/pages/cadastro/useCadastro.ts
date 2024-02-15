import axios from "axios"
import { ChangeEvent, useEffect, useState } from "react"
import { getCadastro } from "../../service/getCadastro/getCadastro"

type OptionType<T = { value: string; label: string }> = T;

type OptionProfissaoType<T = { value: string; label: string }> = T;

export const UseCadastro = () => {
    const [showRegister, setShowRegister] = useState(true)
    const [showDateProfissional, setShowDateProfissional] = useState(false)
    const [showRegisterConfirmed, setShowRegisterConfirmed] = useState(false)
    const [isPessoaFisicaChecked, setIsPessoaFisicaChecked] = useState(false)
    const [isPessoaJuridicaChecked, setIsPessoaJuridicaChecked] = useState(false)
    const [cpf, setCPF] = useState('')
    const [cnpj, setCNPJ] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereço, setEndereço] = useState('')
    const [enderecocep, setCep] = useState('')
    const [endereconumero, setNumero] = useState('')
    const [formCompleted, setFormCompleted] = useState(false)
    const [enderecoAutoPreenchido, setEnderecoAutoPreenchido] = useState('')
    const [enderecologradouro, setLogradouro] = useState('')
    const [enderecobairro, setBairro] = useState('')
    const [enderecomunicipio, setMunicipio] = useState('')
    const [enderecouf, setUf] = useState('')
    const [enderecocomplemento, setComplemento] = useState('')
    const [profissao, setProfissao] = useState<OptionType[]>([])
    const cdcategoria = 199
    const [obs, setObs] = useState('')
    const [selectedOptionsProfissao, setSelectedOptionsProfissao] = useState<OptionType | ''>('');
    const sexo = '';
    const razaosocial = '';
    const inscricaoestadual = '';
    const inscricaomunicipal = '';
    const site = '';
    const nomecontato = '';
    const telefonecontato = '';
    const celularcontato = '';
    const celular = '';
    const cdclienteprofissao = typeof selectedOptionsProfissao === 'object' ? selectedOptionsProfissao.value : ''
    const acao = 'criarCliente'
    const hash = '12345'

    console.log(parseInt(cdclienteprofissao))

    const cadastrar = async () => {

        const result = await getCadastro(
            acao,
            hash,
            email,
            enderecocep,
            enderecologradouro,
            endereconumero,
            enderecocomplemento,
            enderecobairro,
            enderecouf,
            enderecomunicipio,
            telefone,
            cpf,
            cnpj,
            sexo,
            razaosocial,
            inscricaomunicipal,
            inscricaoestadual,
            site,
            nomecontato,
            telefonecontato,
            celularcontato,
            celular,
            nome,
            cdcategoria,
            parseInt(cdclienteprofissao),
        )

        if (result?.message) {
            alert(result.message)
        } else {

        }
    }

    const fetchProfissao = async (): Promise<OptionProfissaoType | any> => {
        try {
            const result = await axios.get('https://esteticabio.w3erp.com.br/w3erp/pub/WS?hash=12345&&chave=clienteprofissao')
            const response = result.data

            const parse = new DOMParser()
            const xml = parse.parseFromString(response, 'text/xml')
            const profissoes = xml.querySelectorAll('clienteprofissao')

            const profissaoOptions: OptionType<{ value: string; label: string }>[] = Array.from(profissoes).map((profissao) => ({
                value: profissao.querySelector('codigo')?.textContent || '',
                label: profissao.querySelector('nome')?.textContent || '',
            }));
            return profissaoOptions

        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        fetchProfissao().then((profissaoOptions) => {
            setProfissao(profissaoOptions)
        })
    }, [])

    const validateForm = () => {
        const isCpfValid = isPessoaFisicaChecked && cpf;
        const isCnpjValid = isPessoaJuridicaChecked && cnpj;
        const isEmailValid = email

        if (
            ((isPessoaFisicaChecked && isCpfValid) ||
                (isPessoaJuridicaChecked && isCnpjValid)) &&
            isEmailValid &&
            telefone &&
            enderecocep &&
            endereconumero &&
            nome
        ) {
            setFormCompleted(true)
            setShowDateProfissional(true)
            setShowRegister(false)
        } else {
            setFormCompleted(false)
            alert('todos os campos sao obrigatórios')
        }
    }




    const handleCepChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const cepValue = e.target.value

        setCep(cepValue)

        if (cepValue.length === 8) {
            try {
                const response = await axios.get(
                    `https://viacep.com.br/ws/${cepValue}/json/`
                )
                const { logradouro, bairro, localidade, uf } = response.data

                const enderecoCompleto = `${logradouro}, ${bairro}, ${localidade}, ${uf}`
                setLogradouro(logradouro)
                setMunicipio(localidade)
                setBairro(bairro)
                setUf(uf)
                setEnderecoAutoPreenchido(enderecoCompleto)
                setEndereço(enderecoCompleto)
            } catch (error) {
                console.error('Erro ao buscar endereço:', error)
                setEnderecoAutoPreenchido('Endereço não encontrado')
                setEndereço('')
            }
        } else {
            setEnderecoAutoPreenchido('')
            setEndereço('')
        }
    }

    const handleSubmitNext = () => {

        validateForm()
    }
    const handleSubmitBack = () => {
        setShowRegister(true)
        setShowDateProfissional(false)
    }

    const handleSubmitRegister = () => {
        setShowRegisterConfirmed(true)
        setShowDateProfissional(false)
    }

    const handlePessoaFisicaChange = () => {
        setIsPessoaFisicaChecked(true)
        setIsPessoaJuridicaChecked(false)
    }

    const handlePessoaJuridicaChange = () => {
        setIsPessoaJuridicaChecked(true)
        setIsPessoaFisicaChecked(false)
    }

    const handleInputChange = () => {
        validateForm()
    }

    const handleChangeProfissao = (selected: OptionType | null) => {
        setSelectedOptionsProfissao(selected || '');
    }

    return {
        showRegister,
        setShowRegister,
        showDateProfissional,
        setShowDateProfissional,
        showRegisterConfirmed,
        setShowRegisterConfirmed,
        isPessoaFisicaChecked,
        setIsPessoaFisicaChecked,
        isPessoaJuridicaChecked,
        setIsPessoaJuridicaChecked,
        cpf,
        setCPF,
        cnpj,
        setCNPJ,
        nome,
        setNome,
        email,
        setEmail,
        telefone,
        setTelefone,
        endereço,
        setEndereço,
        enderecocep,
        setCep,
        endereconumero,
        setNumero,
        formCompleted,
        setFormCompleted,
        enderecoAutoPreenchido,
        setEnderecoAutoPreenchido,
        enderecocomplemento,
        setComplemento,
        setProfissao,
        profissao,
        cdcategoria,
        obs,
        setObs,
        handleSubmitNext,
        handleSubmitBack,
        handleSubmitRegister,
        handlePessoaFisicaChange,
        handlePessoaJuridicaChange,
        handleInputChange,
        handleCepChange,
        cadastrar,
        handleChangeProfissao,
        selectedOptionsProfissao,
    }
}