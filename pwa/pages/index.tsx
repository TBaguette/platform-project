import Head from "next/head";
import React from "react";
import DonutComponent from "../components/diagram/DonutDiagram";
import BarComponent from "../components/diagram/BarDiagram";
import LinearComponent from "../components/diagram/LinearDiagram";

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
            <LinearComponent/>
            <BarComponent/>
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

                .grid > .chart {
                    text-align: center;
                    min-height: 500px;
                }

                .grid > .chart:last-child:nth-child(odd) {
                    grid-column: 1 / 3;
                }

                .chart {
                    position: relative;
                }

                .chart.loading svg {
                    opacity: 0;
                }

                .loading:before {
                    content: "";
                    position: absolute;
                    top: calc(50% - 30px);
                    left: calc(50% - 30px);
                    width: 50px;
                    height: 50px;
                    border-top: 5px solid #38a9b4;
                    border-left: 5px solid #38a9b4;
                    border-radius: 50%;
                    animation: loading 0.5s linear infinite;
                }

                @keyframes loading {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                label {
                    color: #38a9b4;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 15px;
                }

                .choice {
                    display: inline-block;
                    position: relative;
                    margin: 5px;
                }

                select {
                    cursor: pointer;
                    border: 2px solid #38a9b4;
                    border-radius: 5px;
                    background-color: #ffffff;
                    padding: 5px;
                    width: 150px;
                    text-align: center;
                    font-size: 15px;
                }

                select ~ span {
                    position: absolute;
                    top: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 100%;
                    border-radius: 0 3px 3px 0;
                    pointer-events: none;
                }

                select ~ span::before {
                    content: "▼";
                    cursor: pointer;
                    color: #ffffff;
                    font-size: 10px;
                    background-color: #38a9b4;
                    position: absolute;
                    top: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 100%;
                    border-radius: 0 3px 3px 0;
                }
                
                input[type="number"] {
                    width: 75px;
                }

                input[type="number"], input[type="date"] {
                    border: 2px solid #38a9b4;
                    border-radius: 5px;
                    padding: 5px;
                    text-align: center;
                    font-size: 15px;
                }

                input[type="number"] ~ .up::after {
                    content: "▲";
                    top: 0;
                    border-radius: 0 3px 0 0;
                }

                input[type="number"] ~ .down::after {
                    content: "▼";
                    top: 50%;
                    border-radius: 0 0 3px 0;
                }

                input[type="number"] ~ span::after {
                    content: "";
                    cursor: pointer;
                    color: #ffffff;
                    font-size: 10px;
                    background-color: #38a9b4;
                    position: absolute;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 50%;
                }


                input[type="number"] ~ span:hover::after {
                    color: #38a9b4;
                    background-color: #ffffff;
                }

                /***** MEDIAS *****/

                @media (max-width: 1800px) {
                    .grid {
                        display: flex;
                        flex-direction: column;
                    }

                    .grid > .chart {
                        width: fit-content;
                        align-self: center;
                    }
                }

                @media (max-width: 1200px) {
                    .main__content {
                        width: 100%;
                        text-align: center;
                        padding: 20px;
                    }
                }

                @media (max-width: 1000px) {
                    .grid > .chart {
                        transform: scale(0.8);
                    }
                }


                @media (max-width: 800px) {
                    .grid > .chart {
                        transform: scale(0.6);
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
