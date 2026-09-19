"""
Comprehensive Advanced Test Suite for VoteChain / CertiChain Blockchain Subsystem
Verifies:
1. RSA & ECDSA Key generation and signature verification
2. Batch signature verification
3. Merkle Tree proofs & Sparse Merkle Trees
4. Zero-Knowledge Ballot proofs & Nullifier derivation
5. Proof of Work & Dynamic Difficulty
6. PBFT Multi-Node Consensus & Byzantine Fault Isolation
7. Full Chain Integrity & Tamper Detection
"""
import unittest
import time
import json
import hashlib

from blockchain.crypto_utils import (
    get_or_create_institution_keys,
    get_or_create_ec_keys,
    get_public_key_pem,
    sha256_hash,
    sha3_256_hash,
    sign_payload,
    sign_payload_ecdsa,
    verify_signature,
    verify_signature_ecdsa,
    batch_verify_signatures
)
from blockchain.merkle import MerkleTree, SparseMerkleTree
from blockchain.zk_proofs import ZeroKnowledgeBallotProof, zk_engine
from blockchain.miner import ProofOfWorkMiner
from blockchain.consensus import ConsensusNetwork
from blockchain.core import Blockchain, Block, Transaction

class TestCryptoUtils(unittest.TestCase):
    def test_rsa_signature_lifecycle(self):
        payload = {"election_id": 1, "candidate": "Alice", "nonce": 42}
        sig = sign_payload(payload)
        self.assertTrue(len(sig) > 0)
        self.assertTrue(verify_signature(payload, sig))

        # Tampered payload must fail
        tampered = {"election_id": 1, "candidate": "Eve", "nonce": 42}
        self.assertFalse(verify_signature(tampered, sig))

    def test_ecdsa_signature_lifecycle(self):
        payload = {"action": "KIOSK_VOTE_CAST", "kiosk_id": "EVM-01", "timestamp": time.time()}
        sig = sign_payload_ecdsa(payload)
        self.assertTrue(len(sig) > 0)
        self.assertTrue(verify_signature_ecdsa(payload, sig))

        tampered = {"action": "KIOSK_VOTE_CAST", "kiosk_id": "EVM-ROGUE", "timestamp": time.time()}
        self.assertFalse(verify_signature_ecdsa(tampered, sig))

    def test_batch_verify_signatures(self):
        batch = []
        for i in range(5):
            p = {"tx_index": i, "value": f"vote_{i}"}
            s = sign_payload(p)
            batch.append((p, s))

        all_valid, valid_count, failed = batch_verify_signatures(batch)
        self.assertTrue(all_valid)
        self.assertEqual(valid_count, 5)
        self.assertEqual(len(failed), 0)

        # Inject one invalid signature
        batch[2] = ({"tx_index": 2, "value": "corrupted"}, batch[2][1])
        all_valid, valid_count, failed = batch_verify_signatures(batch)
        self.assertFalse(all_valid)
        self.assertEqual(valid_count, 4)
        self.assertEqual(failed, [2])


class TestMerkleTree(unittest.TestCase):
    def test_merkle_tree_proofs(self):
        txs = [
            {"vote_hash": sha256_hash("vote_1"), "candidate": "Alice"},
            {"vote_hash": sha256_hash("vote_2"), "candidate": "Bob"},
            {"vote_hash": sha256_hash("vote_3"), "candidate": "Charlie"},
            {"vote_hash": sha256_hash("vote_4"), "candidate": "Diana"}
        ]
        tree = MerkleTree(txs)
        self.assertTrue(len(tree.root_hash) == 64)

        for i, tx in enumerate(txs):
            proof = tree.get_proof(i)
            is_valid = MerkleTree.verify_proof(tx["vote_hash"], proof, tree.root_hash)
            self.assertTrue(is_valid, f"Proof failed for transaction #{i}")

        # Invalid leaf hash must fail verification
        bogus_hash = sha256_hash("bogus_vote")
        self.assertFalse(MerkleTree.verify_proof(bogus_hash, tree.get_proof(0), tree.root_hash))

    def test_sparse_merkle_tree(self):
        smt = SparseMerkleTree(depth=16)
        initial_root = smt.get_root()
        self.assertTrue(len(initial_root) == 64)

        smt.update(101, sha256_hash("student_2026_eligible"))
        smt.update(102, sha256_hash("student_2027_eligible"))
        updated_root = smt.get_root()
        self.assertNotEqual(initial_root, updated_root)


class TestZeroKnowledgeBallotProof(unittest.TestCase):
    def test_zk_proof_generation_and_verification(self):
        secret = zk_engine.generate_voter_secret()
        election_id = 42
        candidate_id = 3
        valid_candidates = [1, 2, 3, 4]
        used_nullifiers = set()

        # 1. Generate ZK ballot package
        zk_ballot = zk_engine.generate_zk_ballot_proof(
            voter_secret=secret,
            election_id=election_id,
            candidate_id=candidate_id,
            valid_candidate_ids=valid_candidates
        )

        nullifier = zk_ballot["nullifier"]
        proof = zk_ballot["proof"]

        # 2. Verify proof
        is_valid, msg = zk_engine.verify_zk_ballot_proof(proof, used_nullifiers)
        self.assertTrue(is_valid, msg)

        # 3. Double-spend prevention
        used_nullifiers.add(nullifier)
        is_valid, msg = zk_engine.verify_zk_ballot_proof(proof, used_nullifiers)
        self.assertFalse(is_valid)
        self.assertIn("already consumed", msg)


class TestMinerAndConsensus(unittest.TestCase):
    def test_proof_of_work_mining(self):
        miner = ProofOfWorkMiner(default_difficulty=2)
        nonce, mined_hash, timestamp = miner.mine_sync(
            block_index=1,
            prev_hash="0" * 64,
            merkle_root=sha256_hash("test_merkle_root"),
            difficulty=2
        )
        self.assertTrue(mined_hash.startswith("00"))
        self.assertTrue(nonce >= 0)

    def test_dynamic_difficulty_adjustment(self):
        miner = ProofOfWorkMiner(default_difficulty=3)
        # Fast block (< target / 2 = 5s) -> difficulty should increment
        increased = miner.adjust_difficulty(last_block_time=100.0, current_time=102.0, current_difficulty=3)
        self.assertEqual(increased, 4)

        # Slow block (> target * 2 = 20s) -> difficulty should decrement
        decreased = miner.adjust_difficulty(last_block_time=100.0, current_time=130.0, current_difficulty=4)
        self.assertEqual(decreased, 3)

    def test_pbft_consensus_and_byzantine_faults(self):
        net = ConsensusNetwork()
        status = net.get_network_status()
        self.assertEqual(status["totalNodes"], 4)
        self.assertEqual(status["activeNodes"], 4)

        block_data = {"index": 10, "hash": "000abc1234567890", "nonce": 4120}
        broadcast_res = net.simulate_consensus_broadcast(block_data)
        self.assertTrue(broadcast_res["consensusReached"])
        self.assertEqual(len(broadcast_res["validationSteps"]), 5)

        # Test Byzantine fault logging
        net.record_byzantine_fault("NODE-04", "Invalid signature broadcast attempt")
        self.assertEqual(len(net.byzantine_fault_log), 1)


class TestBlockchainLedger(unittest.TestCase):
    def test_blockchain_lifecycle_and_tampering(self):
        bc = Blockchain(difficulty=2)
        bc.create_genesis_block()
        self.assertEqual(len(bc.chain), 1)
        self.assertTrue(bc.validate_chain()["isValid"])

        # Add transaction
        tx = Transaction(
            tx_id="TX-UNIT-001",
            anonymous_vote_id="VOTE-UNIT-001",
            election_id=1,
            candidate_id=2,
            candidate_name="Test Candidate",
            status="PENDING"
        )
        added = bc.add_transaction(tx)
        self.assertTrue(added)

        # Mine block
        new_block, consensus = bc.mine_pending_block(difficulty=2)
        self.assertEqual(len(bc.chain), 2)
        self.assertEqual(new_block.index, 1)
        self.assertTrue(bc.validate_chain()["isValid"])

        # Test Merkle receipt lookup
        receipt = bc.get_transaction_receipt("TX-UNIT-001")
        self.assertIsNotNone(receipt)
        self.assertTrue(receipt["proofVerified"])

        # Test tamper detection
        bc.tamper_block_for_demo(1, "HACKED CHOICE")
        validation = bc.validate_chain()
        self.assertFalse(validation["isValid"])
        self.assertTrue(len(validation["errors"]) > 0)


if __name__ == '__main__':
    unittest.main()
