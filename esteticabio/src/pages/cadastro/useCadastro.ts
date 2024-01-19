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
    const [cep, setCep] = useState('')
    const [numero, setNumero] = useState('')
    const [formCompleted, setFormCompleted] = useState(false)
    const [enderecoAutoPreenchido, setEnderecoAutoPreenchido] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [bairro, setBairro] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [uf, setUf] = useState('')
    const [complemento, setComplemento] = useState('')
    const [profissao, setProfissao] = useState<OptionType[]>([])
    const [cdcategoria, setCdCategoria] = useState("199")
    const [obs, setObs] = useState('')
    const [selectedOptionsProfissao, setSelectedOptionsProfissao] = useState<OptionType | ''>('');
    const [selectedOptionsCategoria, setSelectedOptionsCategoria] = useState<OptionType | ''>('');
    const obsProfissaoCategoria =
        `Profissão: ${typeof selectedOptionsProfissao === 'object' ? selectedOptionsProfissao.label : ''}\n`
        + `Cateogia: 199\n`
        + `Observação: ${obs}\n`;
    const acao = 'criarLeadWebServiceByLandingPage'
    const hash = '12345'
    const caixaPostal = ''
    const cdTelefoneTipo = '1'
    const empresa = ''
    const observacao = obsProfissaoCategoria

    const cadastrar = async () => {
        const observacaoFormatada = observacao.replace(/\n/g, '\n');

        const result = await getCadastro(
            acao,
            nome,
            hash,
            email,
            observacaoFormatada,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            uf,
            municipio,
            caixaPostal,
            telefone,
            cdTelefoneTipo,
            empresa,
        )

        if (result?.message) {
            alert(result.message)
        } else {
            alert('cadastro efetuado com sucesso')
        }
    }

    useEffect(() => {
        setCdCategoria("199")
    }, []);

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
        const isCpfValid = isPessoaFisicaChecked && validateCpf(cpf);
        const isCnpjValid = isPessoaJuridicaChecked && validateCnpj(cnpj)
        const isEmailValid = validateEmail(email)

        if (
            ((isPessoaFisicaChecked && isCpfValid) ||
                (isPessoaJuridicaChecked && isCnpjValid)) &&
            isEmailValid &&
            telefone &&
            endereço &&
            cep &&
            numero &&
            nome
        ) {
            setFormCompleted(true)
            setShowDateProfissional(true)
            setShowRegister(false)
        } else {
            setFormCompleted(false)
            alert('todos os campos sao obrigatorios')
        }
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }

    const validateCpf = (cpf: string): boolean => {
        const cleanCpf = cpf.replace(/\D/g, '')

        if (cleanCpf.length !== 11) {
            return false
        }

        if (/^(\d)\1+$/.test(cleanCpf)) {
            return false;
        }

        let sum = 0
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
        }

        let remainder = sum % 11
        const digit1 = remainder < 2 ? 0 : 11 - remainder

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
        }

        remainder = sum % 11;
        const digit2 = remainder < 2 ? 0 : 11 - remainder;

        return digit1 === parseInt(cleanCpf.charAt(9)) && digit2 === parseInt(cleanCpf.charAt(10))

    }

    const validateCnpj = (cnpj: string): boolean => {
        const cleanCnpj = cnpj.replace(/\D/g, '');

        if (cleanCnpj.length !== 14) {
            return false;
        }

        let sum = 0;
        let factor = 5;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleanCnpj.charAt(i)) * factor;
            factor = factor === 2 ? 9 : factor - 1;
        }

        let remainder = sum % 11;
        const digit1 = remainder < 2 ? 0 : 11 - remainder;

        sum = 0;
        factor = 6;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cleanCnpj.charAt(i)) * factor;
            factor = factor === 2 ? 9 : factor - 1;
        }

        remainder = sum % 11;
        const digit2 = remainder < 2 ? 0 : 11 - remainder;

        return digit1 === parseInt(cleanCnpj.charAt(12)) && digit2 === parseInt(cleanCnpj.charAt(13));
    };

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
                setMunicipio(municipio)
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

    const handleChangeCategoria = (selected: OptionType | null) => {
        setSelectedOptionsCategoria(selected || '');
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
        cep,
        setCep,
        numero,
        setNumero,
        formCompleted,
        setFormCompleted,
        enderecoAutoPreenchido,
        setEnderecoAutoPreenchido,
        complemento,
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
        handleChangeCategoria,
        selectedOptionsProfissao,
        selectedOptionsCategoria,
    }
}