import React from 'react';
import { Link } from 'react-router-dom';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import anvilDesktopImg from '../../assets/img/anvil_with_benchys_right.png';
import PageRuler from '../shared/PageRuler';

import './Home.scss';

export default function Home() {

    return (
        <div className="home-page">

            <section className="home-hero">

                <div className="home-hero-content">
                    <h1 className="home-hero-title">
                        <span className="home-title-line">Build.</span>
                        <span className="home-title-line">Create.</span>
                        <span className="home-title-line">Invent.</span>
                    </h1>
                    <p className="home-hero-services">
                        <span className="home-service-line">3D Print</span>
                        <span className="home-service-line">Laser Cut</span>
                        <span className="home-service-line">Sticker Print</span>
                        <span className="home-service-line">and Much More!</span>
                    </p>
                </div>

                <div className="home-hero-image">
                    <img
                        src={anvilDesktopImg}
                        alt="The Forge makerspace tools and equipment"
                    />
                </div>

                <PageRuler
                    src={rulerMask}
                    side="left"
                    color="var(--color-white)"
                    zIndex={1}
                />

            </section>

            <div className="home-infobar">
                <div className="home-membership">
                    <p>Membership is Only $20 Per Semester!</p>
                </div>
                <Link className="home-cta" to="/getting-started">
                    <span>Get Started</span>
                </Link>
            </div>

        </div>
    );
}
