import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        stayConnected: false,
    });

    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(`Campo alterado: ${name}, Valor: ${type === 'checkbox' ? checked : value}`);
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            email: formData.email,
            senha: formData.password,
        };

        try {
            const response = await fetch('https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/login/acessar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status === 1) {
                alert(`Login realizado com sucesso! Token: ${data.token_de_acesso}`);
                setUserData(data.dados_usuario);
                router.push('/dashboard');
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            alert('Ocorreu um erro ao tentar realizar o login. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="container" style={{ 
            backgroundImage: 'url(/images/bgimage/bg.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '100vh' 
        }}>
            <div className="login-container">
                <h1>Bem-vindo a Innovation Brindes</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Usuário:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label>
                            <input
                                type="checkbox"
                                name="stayConnected"
                                checked={formData.stayConnected}
                                onChange={handleChange}
                            />
                            Manter logado
                        </label>
                        <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: '14px' }}>Esqueceu a senha?</a>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}