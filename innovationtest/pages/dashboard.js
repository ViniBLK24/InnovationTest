import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell } from '../components/utils.js/icons';

export default function Dashboard() {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(false);
    const router = useRouter();

    const generateRandomPrice = () => {
        return (Math.random() * (20 - 10) + 10).toFixed(2);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Verifica se está no ambiente do cliente
                if (typeof window === 'undefined') return;

                const token = localStorage.getItem('token_de_acesso');
                if (!token) {
                    alert('Token de acesso não encontrado. Redirecionando para a página de login.');
                    router.push('/');
                    return;
                }

                const response = await fetch('https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/produtos/listar', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar os produtos. Verifique o token ou a API.');
                }

                const data = await response.json();

                const productsWithPrices = data.map((product) => ({
                    ...product,
                    preco: product.nome.toLowerCase().includes('copo plástico') ? '4.99' : generateRandomPrice(),
                }));

                setAllProducts(productsWithPrices);
                setProducts(productsWithPrices);
            } catch (error) {
                console.error('Erro ao buscar os produtos:', error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [router]);

    useEffect(() => {
        if (filter) {
            const filteredProducts = allProducts.filter((product) =>
                product.nome.toLowerCase().includes('copo plástico')
            );
            setProducts(filteredProducts);
        } else {
            setProducts(allProducts);
        }
    }, [filter, allProducts]);

    return (
        <div>
            <header style={{ backgroundColor: '#119417', padding: '10px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img
                    src="/images/others/logo.png"
                    alt="Logo"
                    style={{ width: '180px', height: '60px', borderRadius: '0%', marginLeft: '80px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px', cursor: 'pointer' }} />
                        <FontAwesomeIcon icon={faBell} style={{ marginRight: '10px', cursor: 'pointer' }} />
                        <span style={{ marginRight: '10px' }}>Neymar Santos Jr.</span>
                        <img
                            src="/images/others/user.jpeg"
                            alt="Usuário"
                            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px', cursor: 'pointer' }}
                        />
                    </div>
                    <div>Quarta, 01/04/2025</div>
                </div>
            </header>
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setFilter(false)}
                    className={`button ${!filter ? 'active' : 'inactive'}`}
                >
                    Todos os Produtos
                </button>
                <button
                    onClick={() => setFilter(true)}
                    className={`button ${filter ? 'active' : 'inactive'}`}
                >
                    Filtrar: Copo Plástico
                </button>
            </div>
            <main style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#555' }}>Carregando produtos...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {products.map((product) => (
                            <div key={product.codigo} style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '15px', textAlign: 'center' }}>
                                <img src={product.imagem} alt={product.nome} style={{ width: '170px', height: '130px', objectFit: 'cover', borderRadius: '10px' }} />
                                <h3 style={{ margin: '10px 0', fontSize: '18px', color: '#119417' }}>{product.nome}</h3>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Código: {product.codigo}</p>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>{product.descricao}</p>
                                <p style={{ margin: '10px 0', fontSize: '16px', fontWeight: 'bold', color: '#119417' }}>R$ {product.preco}</p>
                                <button style={{ backgroundColor: '#119417', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                                    CONFIRA
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}