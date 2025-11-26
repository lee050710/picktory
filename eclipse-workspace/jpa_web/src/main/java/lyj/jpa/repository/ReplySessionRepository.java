package lyj.jpa.repository;

import java.util.*;

import lyj.jpa.model.Reply;
import jakarta.persistence.*;

public class ReplySessionRepository {
    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpa_javaPU");

    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public Reply selectReplyByPrimaryKey(Long replyNo) {
        EntityManager entityManager = getEntityManager();
        try {
            return entityManager.find(Reply.class, replyNo);
        } finally {
            entityManager.close();
        }
    }

    /**
     * 조건에 따라 Reply 목록을 조회합니다.
     * JPQL 구성 및 파라미터 바인딩 로직을 개선했습니다.
     */
    public List<Reply> selectReplyByCondition(Map<String, Object> condition) {
        EntityManager entityManager = getEntityManager();
        try {
            StringBuilder jpql = new StringBuilder("SELECT r FROM Reply r WHERE 1=1");
            
            // 1. JPQL 쿼리 구성
            if (condition != null) {
                // AND 앞에 공백을 확실히 넣어 문법 오류 방지
                if (condition.containsKey("commentNo")) {
                    jpql.append(" AND r.commentNo = :commentNo");
                }
                if (condition.containsKey("userId")) {
                    jpql.append(" AND r.replyUserId = :userId"); // 필드명 확인 (Reply.java에 replyUserId로 정의)
                }
                if (condition.containsKey("replyContent")) {
                    jpql.append(" AND r.replyContent LIKE :replyContent");
                }
            }
            
            TypedQuery<Reply> query = entityManager.createQuery(jpql.toString(), Reply.class);
            
            // 2. 파라미터 바인딩
            if (condition != null) {
                if (condition.containsKey("commentNo")) {
                    query.setParameter("commentNo", condition.get("commentNo"));
                }
                // *주의: 필드명 확인 및 타입 변환이 필요할 수 있습니다.
                if (condition.containsKey("userId")) {
                    query.setParameter("userId", condition.get("userId"));
                }
                if (condition.containsKey("replyContent")) {
                    // LIKE 검색을 위해 % 와일드카드 추가
                    query.setParameter("replyContent", "%" + condition.get("replyContent") + "%");
                }
            }
            
            return query.getResultList();
        } finally {
            entityManager.close();
        }
    }

    public Integer insertReply(Reply reply) {
        EntityManager entityManager = getEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            entityManager.persist(reply);
            tx.commit();
            return 1;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }

    public Integer updateReply(Reply reply) {
        EntityManager entityManager = getEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            entityManager.merge(reply);
            tx.commit();
            return 1;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }

    public Integer deleteReply(Long replyNo) {
        EntityManager entityManager = getEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            Reply reply = entityManager.find(Reply.class, replyNo);
            if (reply != null) {
                entityManager.remove(reply);
                tx.commit();
                return 1;
            }
            // 찾지 못한 경우에도 트랜잭션은 커밋해야 함 (DB 변경 없음)
            tx.commit();
            return 0;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }
}