import {useState, useEffect} from 'react';
import CommonSection from '../components/shared/CommonSection';
import '../styles/tour.css';
import {Container, Row, Col} from 'reactstrap';
 import tourData from '../assets/data/tours';
import TourCard from '../components/shared/TourCard';
import '../styles/global.css';

import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';

const Tours = () => {
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(0)

 // const {data:tours, loading, error} = useFetch(`${BASE_URL}/tours?page=&{page}`)
 const loading = false;
 const error = false; 
 const {data:tourCount} = useFetch(`${BASE_URL}/tours/search/getTourCount`)

  useEffect(() => {
    const pages = Math.ceil(5 / 4);
    setPageCount(pages)
    window.scrollTo(0, 0)
  }, [page]);

  return (
    <>
      <CommonSection title={'All Tours'} />
      <section>
        <Container>
          <Row>
          
          </Row>
        </Container>
      </section>
      <section className='pt-0'>
        <Container>
          {loading && <h4 className='text-center pt-5'>Loading.....</h4>}
          {error && <h4 className='text-center pt-5'>{error}</h4>}
          {
            !loading && !error && <Row>
            {tourData?.map(tour => (
              <Col lg='3' md='6' sm='6' className='mb-4' key={tour._id}>
                <TourCard tour={tour} />
              </Col>
            ))}

            <Col lg='12'>
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span key={number} onClick={() => setPage(number)}
                  className={page===number ? 'active__page' : ""}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>

            

          </Row>
          }
        </Container>
      </section>
      
    </>
  )
}

export default Tours