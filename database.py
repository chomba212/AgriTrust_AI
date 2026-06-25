import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

class Neo4jConnection:
    def __init__(self):
        self._driver = None
        try:
            self._driver = GraphDatabase.driver(
                NEO4J_URI, 
                auth=(NEO4J_USER, NEO4J_PASSWORD)
            )
            print("Neo4j Driver initialized successfully via environment parameters.")
        except Exception as e:
            print(f"Driver initialization error: {e}")

    def close(self):
        if self._driver:
            self._driver.close()

    def query(self, query, parameters=None):
        if not self._driver:
            raise Exception("Graph driver connection stream is closed.")
        
        session = self._driver.session()
        try:
            result = session.run(query, parameters)
            return [record.data() for record in result]
        except Exception as query_error:
            raise query_error
        finally:
            session.close()

db = Neo4jConnection()