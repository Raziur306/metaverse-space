// import prisma from "@repo/db/client";
const BASE_URL = "http://localhost:3000";

test("Health test", async () => {
  const res = await fetch(BASE_URL + "/health");
  const data = await res.json();
  expect(data.health).toBe("Server is running");
});

describe("Authorization test", () => {
  test("Signup Test", async () => {
    const res = await (
      await fetch(BASE_URL + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "example@gmail.com",
          password: "password",
          name: "Test Name",
        }),
      })
    ).json();
    expect(res.name).toBe("Test Name");
  });

  test("Signin Test", async () => {
    const res = await (
      await fetch(BASE_URL + "/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "example@gmail.com",
          password: "password",
        }),
      })
    ).json();
    console.log(res);
   // expect(res.token).toBeDefined();
    // await prisma.user.delete({
    //   where: {
    //     email: "example@gmail.com",
    //   },
    // });
  });
});
