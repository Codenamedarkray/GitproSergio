const request = require('supertest');
const express = require('express');
const tripRoutes = require('./tripRoutes'); // ajuste o caminho se necessário

const app = express();
app.use(express.json());
app.use('/api/v1/trip', tripRoutes);

describe('Testes Unitários - Módulo TRIP (Cálculo de Viagem)', () => {
    
    test('Deve calcular o custo de combustível corretamente', async () => {
        const response = await request(app)
            .post('/api/v1/trip/cost')
            .send({
                distanceKm: 200,
                autonomyKmL: 10,
                priceGasoline: 5.50,
                priceAlcohol: 3.80
            });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.costGasoline).toBe(110.00); // (200/10) * 5.50
    });

    test('Deve calcular a quantidade e valor dos pedágios', async () => {
        const response = await request(app)
            .post('/api/v1/trip/tolls')
            .send({ distanceKm: 160 });

        expect(response.statusCode).toBe(200);
        expect(response.body.tollCount).toBe(2);
        expect(response.body.totalTollCost).toBe(24.00);
    });

    test('Deve calcular o tempo estimado de viagem', async () => {
        const response = await request(app)
            .post('/api/v1/trip/time')
            .send({ distanceKm: 180, averageSpeedKmH: 90 });

        expect(response.statusCode).toBe(200);
        expect(response.body.formattedTime).toBe('2h 0min');
    });
});