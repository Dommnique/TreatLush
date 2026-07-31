function Process() {
    return (
        <>
          <section className="process-section">
            <h2>Our Process</h2>
            
            <div className="process-diagram">
                <div className="card">
                    <div className="linked">
                        <div className="step">01</div>
                        <div className="linker"></div>
                    </div>

                    <div className="detail">
                        <h3>Fresh Ingredients</h3>
                        <p>We source only the finest ingredients.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="linked">
                        <div className="step">02</div>
                        <div className="linker"></div>
                    </div>

                    <div className="detail">
                        <h3>Handcrafted Daily</h3>
                        <p>Every order is prepared with care.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="linked">
                        <div className="step">03</div>
                        <div className="linker"></div>
                    </div>

                    <div className="detail">
                        <h3>Packed With Care</h3>
                        <p>Sealed for freshness and quality.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="linked">
                        <div className="step">04</div>
                    </div>

                    <div className="detail">
                        <h3>Delivered Timely</h3>
                        <p>Enjoy TreatLush wherever you are.</p>
                    </div>
                </div>
            
            </div>
          </section>
        </>
    )
}

export default Process