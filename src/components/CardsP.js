import React from "react";
import { useNavigate } from "react-router-dom";

const CardsP = ({ productos }) => {
    const navigate = useNavigate();

    const handleVerMas = (id) => {
        navigate(`/producto/${id}`);
    };

    return (
        <div className="row g-4">
        {productos.map((producto) => (
            <div key={producto._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
                <img src={producto.image} alt={producto.title} className="card-img-top" />
        
                <div className="card-body">
                <h5 className="card-title">{producto.title}</h5>
                <p className="card-text text-muted">{producto.description}</p>
        
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold text-success">${producto.price.toFixed(2)}</span>
                    {producto.discount > 0 && (
                    <span className="badge bg-danger">-{producto.discount}%</span>
                    )}
                </div>
                
                <p className="mt-2 text-secondary">
                    <strong>Categoría:</strong> {producto.category} <br />
                    <strong>Marca:</strong> {producto.brand} <br />
                </p>
                
                <p className="text-warning">
                    ★ {producto.rating} ({producto.reviews} reseñas)
                </p>
                
                <button 
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => handleVerMas(producto._id)}
                >
                    Ver Más
                </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    );
};

export default CardsP;