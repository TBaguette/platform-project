import Head from "next/head";
import React from "react";
import DonutComponent from "../components/diagram/DonutDiagram";

const Welcome = () => (
  <>
    <Head>
      <title>Visualisation des ventes immobilières !</title>
    </Head>

    <div className="app">
      <section className="main">
        <div className="main__content">
          <h1>
            Visualisation des <strong>ventes immobilières</strong> !
          </h1>
          
          <div className="grid">
            <DonutComponent/>
            <DonutComponent/>
            <DonutComponent/>
          </div>
        </div>
      </section>

      <style jsx global>{`
                @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,700|Roboto+Slab:300,700");

                body {
                    margin: 0;
                }

                .app {
                    height: 100vh;
                    width: 100vw;
                    text-align: center;
                    color: #1d1e1c;
                    font-family: "Open Sans", sans-serif;
                    font-size: 14px;
                    overflow: auto;
                    background-color: #ececec;
                }

                .app a {
                    text-decoration: none;
                    color: #38a9b4;
                    font-weight: bold;
                }

                .app h1 {
                    font-family: "Roboto Slab", serif;
                    font-weight: 300;
                    font-size: 36px;
                    margin: 0 0 10px;
                    line-height: 30px;
                }

                .app h1 strong {
                    font-weight: 700;
                    color: #38a9b4;
                }

                .app h2 {
                    text-transform: uppercase;
                    font-size: 18px;
                    font-weight: bold;
                    margin: 25px 0 5px;
                }

                .app h3 {
                    text-transform: uppercase;
                    font-weight: 500;
                    color: #38a9b4;
                    font-size: 16px;
                    margin: 0 0 5px;
                    display: block;
                }

                /***** MAIN *****/

                .main {
                    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                        0 1px 18px 0 rgba(0, 0, 0, 0.12),
                        0 3px 5px -1px rgba(0, 0, 0, 0.3);
                    width: 80%;
                    margin: 50px auto;
                    margin-left: auto;
                    margin-right: auto;
                    background-color: white;
                    display: flex;
                }

                .main__content {
                    padding: 30px;
                    text-align: left;
                    flex: auto;
                }
                
                .main__button {
                    display: inline-block;
                    padding: 10px 50px 10px 10px;
                    border: 3px solid #339ba5;
                    font-size: 22px;
                    color: #339ba5;
                    text-transform: uppercase;
                    margin: 15px 0;
                    overflow: hidden;
                    transition: all ease 0.3s;
                    cursor: pointer;
                    position: relative;
                }

                .main__button:hover {
                    background-color: #afe5e5;
                }

                .main__button:hover svg {
                    transform: translateY(-50%) rotate(35deg);
                }

                .grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }

                .grid > div {
                    text-align: center;
                }

                .grid > div:last-child:nth-child(odd) {
                    grid-column: 1 / 3;
                }

                /***** MEDIAS *****/

                @media (max-width: 1200px) {
                    .main__content {
                        width: 100%;
                        text-align: center;
                        padding: 20px;
                    }
                }

                @media (max-width: 600px) {
                    .main {
                        width: calc(100% - 40px);
                    }
                    .app h1 {
                        display: none;
                    }
                    .main__content {
                        padding: 10px;
                    }
                }
            `}</style>
    </div>
  </>
);
export default Welcome;