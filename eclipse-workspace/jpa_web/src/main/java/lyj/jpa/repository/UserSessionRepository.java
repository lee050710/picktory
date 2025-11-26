package lyj.jpa.repository;

import jakarta.persistence.*;
import lyj.jpa.model.User;

import java.util.List;
import java.util.Map;
import java.util.HashMap; // Map 타입 사용을 위해 임포트 추가

public class UserSessionRepository {

    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpa_javaPU");

    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    // -----------------------------------------------------------------
    // [R] SELECT - Primary Key로 사용자 조회 (메서드명 변경)
    // -----------------------------------------------------------------

    /**
     * Primary Key(userId)로 단일 사용자 조회
     */
    public User selectUserByPrimaryKey(String userId) { // 💡 메서드명 수정
        EntityManager em = getEntityManager(); // 💡 getEntityManager() 사용
        try {
            return em.find(User.class, userId);
        } finally {
            em.close();
        }
    }

    // -----------------------------------------------------------------
    // [R] SELECT - 조건으로 사용자 목록 조회 (추가된 메서드)
    // -----------------------------------------------------------------

    /**
     * 조건에 따라 User 목록을 조회합니다.
     */
    public List<User> selectUserByCondition(Map<String, Object> condition) {
        EntityManager em = getEntityManager();
        try {
            StringBuilder jpql = new StringBuilder("SELECT u FROM User u WHERE 1=1");

            // 1. JPQL 쿼리 구성
            if (condition != null) {
                // userName 조건 (LIKE 검색)
                if (condition.containsKey("userName")) {
                    jpql.append(" AND u.userName LIKE :userName");
                }
                // userId 조건 (Primary Key는 단일 조회를 사용하는 것이 일반적이지만, 조건 조회에 포함)
                if (condition.containsKey("userId")) {
                    jpql.append(" AND u.userId = :userId");
                }
            }

            TypedQuery<User> query = em.createQuery(jpql.toString(), User.class);

            // 2. 파라미터 바인딩
            if (condition != null) {
                if (condition.containsKey("userName")) {
                    // LIKE 검색을 위해 % 와일드카드 추가
                    query.setParameter("userName", "%" + condition.get("userName") + "%");
                }
                if (condition.containsKey("userId")) {
                    query.setParameter("userId", condition.get("userId"));
                }
            }

            return query.getResultList();
        } finally {
            em.close();
        }
    }


    // -----------------------------------------------------------------
    // [C] INSERT - 사용자 삽입 (트랜잭션 처리는 올바름)
    // -----------------------------------------------------------------

    /**
     * 새로운 사용자 삽입 (트랜잭션 시작)
     */
    public Integer insertUser(User user) {
        EntityManager em = getEntityManager(); // 💡 getEntityManager() 사용
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(user); 
            tx.commit();
            return 1;
        } catch (RuntimeException e) {
            if (tx.isActive()) { tx.rollback(); }
            throw e; 
        } finally {
            em.close();
        }
    }

    // -----------------------------------------------------------------
    // [U] UPDATE - 사용자 정보 수정 (트랜잭션 처리는 올바름)
    // -----------------------------------------------------------------

    /**
     * 기존 사용자 정보 수정 (트랜잭션 시작)
     */
    public Integer updateUser(User user) {
        EntityManager em = getEntityManager(); // 💡 getEntityManager() 사용
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(user); 
            tx.commit();
            return 1;
        } catch (RuntimeException e) {
            if (tx.isActive()) { tx.rollback(); }
            throw e;
        } finally {
            em.close();
        }
    }

    // -----------------------------------------------------------------
    // [D] DELETE - 사용자 삭제 (로직 개선)
    // -----------------------------------------------------------------
    
    /**
     * 사용자 삭제 (트랜잭션 시작)
     */
    public Integer deleteUser(String userId) {
        EntityManager em = getEntityManager(); // 💡 getEntityManager() 사용
        EntityTransaction tx = em.getTransaction();
        int result = 0;
        try {
            tx.begin();
            User user = em.find(User.class, userId);
            
            if (user != null) {
                em.remove(user);
                result = 1;
            }
            // 💡 엔티티를 찾았든 못 찾았든, 트랜잭션이 성공적으로 진행되었으므로 commit
            tx.commit(); 
            return result; 
        } catch (RuntimeException e) {
            if (tx.isActive()) { tx.rollback(); }
            throw e;
        } finally {
            em.close();
        }
    }
}