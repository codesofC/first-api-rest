import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Transactions", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    app.close();
  });
  
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })


  it("should be able to create a new transaction", async () => {
    await request(app.server).post("/transactions").send({
      title: "Novo transação",
      amount: 5000,
      type: "credit",
    }).expect(201)
  });

  it("should be able to list all transactions", async () => {
    const transactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Novo transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = transactionResponse.get("Set-Cookie") || []


    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

      expect(listTransactionResponse.body).toEqual({
        transactions: [
            expect.objectContaining({
                title: 'Novo transação',
                amount: 5000,
            })
        ]
      })
  });

  it("should be able to get a specific transaction", async () => {
    const transactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Novo transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = transactionResponse.get("Set-Cookie") || []


    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

      const idTransactionTest = listTransactionResponse.body.transactions[0].id;

      const getSpecificTransactionResponse = await request(app.server)
      .get(`/transactions/${idTransactionTest}`)
      .set("Cookie", cookies)
      .expect(200);

      expect(getSpecificTransactionResponse.body).toEqual({
        transactions:
            expect.objectContaining({
                title: 'Novo transação',
                amount: 5000,
            })
      })
  });

  it('should be able to get summary\'s transactions'), async () => {
    const transactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Novo transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = transactionResponse.get("Set-Cookie") || []

    await request(app.server)
      .post("/transactions")
      .send({
        title: "Novo transação",
        amount: 2000,
        type: "debit",
      });

      const summaryResponse = await request(app.server)
      .get("/transactions/ssummary")
      .set("Cookie", cookies)
      .expect(200)

      expect(summaryResponse.body).toEqual({
        summary:
            expect.objectContaining({
                total: 3000
            })
      })
  }
});
